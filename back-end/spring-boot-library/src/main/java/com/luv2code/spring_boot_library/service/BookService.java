package com.luv2code.spring_boot_library.service;

import com.luv2code.spring_boot_library.dao.BookRepository;
import com.luv2code.spring_boot_library.dao.CheckoutRepository;
import com.luv2code.spring_boot_library.dao.HistoryRepository;
import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.Checkout;
import com.luv2code.spring_boot_library.entity.History;
import com.luv2code.spring_boot_library.responcemodels.ShelfCurrentLoansResponce;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class BookService {

  private BookRepository bookRepository;

  private CheckoutRepository checkoutRepository;

  private HistoryRepository historyRepository;

  @Autowired
  public BookService(BookRepository bookRepository,
                     CheckoutRepository checkoutRepository,
                     HistoryRepository historyRepository) {
    this.bookRepository = bookRepository;
    this.checkoutRepository = checkoutRepository;
    this.historyRepository = historyRepository;
  }

  public Book checkoutBook(String userEmail, Long bookId) throws Exception {
    Optional<Book> book = bookRepository.findById(bookId);

    Checkout validateCheckout =
        checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

    if (!book.isPresent() || validateCheckout != null ||
        book.get().getCopiesAvailable() <= 0) {
      throw new Exception(
          "Book doesnt exist or it is already checked out by user");
    }

    book.get().setCopiesAvailable(book.get().getCopiesAvailable() - 1);
    bookRepository.save(book.get());

    Checkout checkout = new Checkout(userEmail, LocalDate.now().toString(),
                                     LocalDate.now().plusDays(7).toString(),
                                     book.get().getId());
    checkoutRepository.save(checkout);
    return book.get();
  }

  public boolean checkoutByUser(String userEmail, Long bookId) {
    Checkout validateCheckout =
        checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

    if (validateCheckout != null) {
      return true;
    } else {
      return false;
    }
  }

  // get current Loans count
  public int currentLoansCount(String userEmail) {
    return checkoutRepository.findBooksByUserEmail(userEmail).size();
  }

  // return current Loans

  public List<ShelfCurrentLoansResponce> currentLoans(String userEmail)
      throws Exception {
    List<ShelfCurrentLoansResponce> shelfCurrentLoansResponces =
        new ArrayList<>();

    // Fetch all checkouts by user email
    List<Checkout> checkoutList =
        checkoutRepository.findBooksByUserEmail(userEmail);

    // Extract the book IDs from the checkout list
    List<Long> bookIdList = checkoutList.stream()
                                .map(Checkout::getBookId)
                                .collect(Collectors.toList());

    // Fetch all books by the book IDs
    List<Book> books = bookRepository.findBooksByBookIds(bookIdList);
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    // Loop through each book and match with checkout details
    for (Book book : books) {
      Optional<Checkout> checkout =
          checkoutList.stream()
              .filter(x -> x.getBookId().equals(book.getId()))
              .findFirst();

      if (checkout.isPresent()) {
        Date returnDate = sdf.parse(checkout.get().getReturnDate());
        Date currentDate = sdf.parse(LocalDate.now().toString());

        TimeUnit time = TimeUnit.DAYS;
        long differenceInTime =
            time.convert(returnDate.getTime() - currentDate.getTime(),
                         TimeUnit.MILLISECONDS);

        shelfCurrentLoansResponces.add(
            new ShelfCurrentLoansResponce(book, (int)differenceInTime));
      }
    }

    return shelfCurrentLoansResponces;
  }
  public void returnBook(String userEmail, Long bookId) throws Exception {
    Optional<Book> book = bookRepository.findById(bookId);
    Checkout validateCheckout =
        checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

    if (!book.isPresent() || validateCheckout == null) {
      throw new Exception("Book doesnt exist or not checked out by user");
    }
    book.get().setCopiesAvailable(book.get().getCopiesAvailable() + 1);

    bookRepository.save(book.get());

    checkoutRepository.deleteById(validateCheckout.getId());

    History history =
        new History(userEmail, validateCheckout.getCheckoutDate(),
                    LocalDate.now().toString(), book.get().getTitle(),
                    book.get().getAuthor(), book.get().getDescription(),
                    book.get().getImg());

    historyRepository.save(history);
  }

  public void renewLoan(String userEmail, Long bookId) throws Exception {
    Checkout validateCheckout =
        checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

    if (validateCheckout == null) {
      throw new Exception("Book doesn't exist or not checked out by user");
    }
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

    Date d1 = sdf.parse(validateCheckout.getReturnDate());
    Date d2 = sdf.parse(LocalDate.now().toString());

    if (d1.compareTo(d2) > 0 || d1.compareTo(d2) == 0) {
      validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());
      checkoutRepository.save(validateCheckout);
    }
  }
}
