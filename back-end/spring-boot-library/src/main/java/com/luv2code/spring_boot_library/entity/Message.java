package com.luv2code.spring_boot_library.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "messages")
@Data
public class Message {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id")
  private Long id;

  @Column(name = "user_email") private String userEmail;

  @Column(name = "title") private String title;

  @Column(name = "question") private String question;

  @Column(name = "admin_email") private String adminEmail;

  @Column(name = "response") private String response;

  @Column(name = "closed") private boolean closed;

  public Message() {}

  public Message(String title, String question) {
    this.title = title;
    this.question = question;
  }
}
