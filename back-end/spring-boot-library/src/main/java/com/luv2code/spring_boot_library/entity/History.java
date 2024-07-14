package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "history")
@Data
public class History {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "user_email") private String userEmail;

  @Column(name = "checkout_date") private String checkoutDate;

  @Column(name = "returned_date") private String returnedDate;

  @Column(name = "title") private String title;

  @Column(name = "author") private String author;

  @Column(name = "description") private String description;

  @Column(name = "img") private String img;

  public History() {}

  public History(String userEmail, String checkoutDate, String returnDate,
                 String title, String author, String description, String img) {
    this.userEmail = userEmail;
    this.checkoutDate = checkoutDate;
    this.returnedDate = returnDate;
    this.title = title;
    this.author = author;
    this.description = description;
    this.img = img;
  }
}
