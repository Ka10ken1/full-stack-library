package com.luv2code.spring_boot_library.responcemodels;

import com.luv2code.spring_boot_library.entity.Book;
import lombok.Data;

@Data
public class ShelfCurrentLoansResponce {

  private Book book;

  private int daysLeft;

  public ShelfCurrentLoansResponce(Book book, int daysLeft) {
    this.book = book;
    this.daysLeft = daysLeft;
  }
}
