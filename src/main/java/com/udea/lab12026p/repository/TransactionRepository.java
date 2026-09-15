package com.udea.lab12026p.repository;

import com.udea.lab12026p.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDescIdDesc(String senderAccountNumber, String receiverAccountNumber);

    boolean existsBySenderAccountNumberOrReceiverAccountNumber(String senderAccountNumber, String receiverAccountNumber);
}
