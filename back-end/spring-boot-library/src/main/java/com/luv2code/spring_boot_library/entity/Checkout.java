package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "checkout")
@Data
public class Checkout {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "user_email") private String userEmail;

  @Column(name = "checkout_date") private String checkoutDate;

  @Column(name = "return_date") private String returnDate;

  @Column(name = "book_id") private Long bookId;

  public Checkout() {}

  public Checkout(String userEmail, String checkoutDate, String returnDate,
                  Long bookId) {
    this.userEmail = userEmail;
    this.checkoutDate = checkoutDate;
    this.returnDate = returnDate;
    this.bookId = bookId;
  }
}
