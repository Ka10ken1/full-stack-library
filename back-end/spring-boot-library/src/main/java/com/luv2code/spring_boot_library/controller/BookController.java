package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.responcemodels.ShelfCurrentLoansResponce;
import com.luv2code.spring_boot_library.service.BookService;
import com.luv2code.spring_boot_library.utils.ExtractJwt;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/books")
public class BookController {

  private BookService bookService;

  @Autowired
  public BookController(BookService bookService) {
    this.bookService = bookService;
  }

  @GetMapping("/secure/currentloans")
  public List<ShelfCurrentLoansResponce>
  currentLoans(@RequestHeader("Authorization") String token) throws Exception {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");

    return bookService.currentLoans(userEmail);
  }

  @PutMapping("/secure/checkout")
  public Book checkoutBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");

    return bookService.checkoutBook(userEmail, bookId);
  }

  @GetMapping("/secure/ischeckedout/byuser")
  public boolean
  checkoutoutBookByUser(@RequestHeader(value = "Authorization") String token,
                        @RequestParam Long bookId) {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");
    return bookService.checkoutByUser(userEmail, bookId);
  }

  @GetMapping("/secure/currentloans/count")
  public int
  currentLoansCount(@RequestHeader(value = "Authorization") String token) {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");
    return bookService.currentLoansCount(userEmail);
  }

  @PutMapping("/secure/return")
  public void returnBook(@RequestHeader("Authorization") String token,
                         @RequestParam Long bookId) throws Exception {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");
    bookService.returnBook(userEmail, bookId);
  }

  @PutMapping("/secure/renew/loan")
  public void revewLoa(@RequestHeader("Authorization") String token,
                       @RequestParam Long bookId) throws Exception {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");
    bookService.renewLoan(userEmail, bookId);
  }
}
