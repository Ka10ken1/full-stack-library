package com.luv2code.spring_boot_library.dao;

import com.luv2code.spring_boot_library.entity.Checkout;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CheckoutRepository extends JpaRepository<Checkout, Long> {

  @Query("SELECT c FROM Checkout c WHERE c.userEmail = :userEmail AND "
         + "c.bookId = :bookId")
  Checkout
  findByUserEmailAndBookId(@Param("userEmail") String userEmail,
                           @Param("bookId") Long bookId);

  List<Checkout> findBooksByUserEmail(String userEmail);

  @Modifying
  @Query("delete from Checkout where bookId in :bookId")
  void deleteAllByBookId(@Param("bookId") Long bookId);
}
