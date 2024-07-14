package com.luv2code.spring_boot_library.config;

import com.luv2code.spring_boot_library.entity.Book;
import com.luv2code.spring_boot_library.entity.Message;
import com.luv2code.spring_boot_library.entity.Review;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

  private String theAllowedOrigins = "http://localhost:3000";

  @Override
  public void configureRepositoryRestConfiguration(
      RepositoryRestConfiguration configuration, CorsRegistry cors) {
    HttpMethod[] unsupportedActions = {HttpMethod.POST, HttpMethod.PATCH,
                                       HttpMethod.DELETE, HttpMethod.PUT};

    configuration.exposeIdsFor(Book.class);
    configuration.exposeIdsFor(Review.class);
    configuration.exposeIdsFor(Message.class);

    disableHttpMethods(Book.class, configuration, unsupportedActions);
    disableHttpMethods(Review.class, configuration, unsupportedActions);
    disableHttpMethods(Message.class, configuration, unsupportedActions);

    /* Configure CORS for Mapping */
    cors.addMapping(configuration.getBasePath() + "/**")
        .allowedOrigins(theAllowedOrigins);
  }

  private void disableHttpMethods(Class Theclass,
                                  RepositoryRestConfiguration configuration,
                                  HttpMethod[] unsupportedActions) {

    configuration.getExposureConfiguration()
        .forDomainType(Theclass)
        .withItemExposure(
            (metadata, HttpMethod) -> HttpMethod.disable(unsupportedActions))
        .withCollectionExposure(
            (metadata, HttpMethod) -> HttpMethod.disable(unsupportedActions));
  }
}
