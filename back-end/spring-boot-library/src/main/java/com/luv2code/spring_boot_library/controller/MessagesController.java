package com.luv2code.spring_boot_library.controller;

import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.requestmodels.AdminQuestionRequest;
import com.luv2code.spring_boot_library.service.MessagesService;
import com.luv2code.spring_boot_library.utils.ExtractJwt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("http://localhost:3000")
@RequestMapping("/api/messages")
public class MessagesController {

  private MessagesService messagesService;

  @Autowired
  public MessagesController(MessagesService messagesService) {
    this.messagesService = messagesService;
  }

  @PostMapping("/secure/add/message")
  public void postMessage(@RequestHeader(value = "Authorization") String token,
                          @RequestBody Message messageRequest) {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");
    messagesService.postMessage(messageRequest, userEmail);
  }

  @PutMapping("/secure/admin/message")
  public void putMessage(@RequestHeader(value = "Authorization") String token,
                         @RequestBody AdminQuestionRequest adminQuestionRequest)
      throws Exception {
    String userEmail = ExtractJwt.payloadJwtExtraction(token, "\"sub\"");
    String admin = ExtractJwt.payloadJwtExtraction(token, "\"userType\"");
    if (admin == null || !admin.equals("admin")) {
      throw new Exception("Administration page only.");
    }
    messagesService.putMessage(adminQuestionRequest, userEmail);
  }
}
