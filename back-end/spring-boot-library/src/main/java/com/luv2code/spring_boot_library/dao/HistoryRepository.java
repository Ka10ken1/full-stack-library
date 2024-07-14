package com.luv2code.spring_boot_library.dao;

import com.luv2code.spring_boot_library.entity.History;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestPart;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {
  //
  Page<History> findBooksByUserEmail(@RequestPart("email") String userEmail,
                                     Pageable pageable);
}
