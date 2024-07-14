package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "review")
@Data
public class Review {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "user_email") private String userEmail;

  @Column(name = "date") @CreationTimestamp private Date date;

  @Column(name = "rating") private double rating;

  @Column(name = "book_id") private Long bookId;

  @Column(name = "review_description") private String reviewDescription;
}
