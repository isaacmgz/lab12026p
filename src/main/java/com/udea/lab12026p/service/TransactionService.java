package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.TransactionDTO;
import com.udea.lab12026p.dto.TransferRequestDTO;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.entity.Transaction;
import com.udea.lab12026p.exception.BusinessRuleException;
import com.udea.lab12026p.exception.ResourceNotFoundException;
import com.udea.lab12026p.mapper.TransactionMapper;
import com.udea.lab12026p.repository.CustomerRepository;
import com.udea.lab12026p.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CustomerRepository customerRepository;
    private final TransactionMapper transactionMapper;

    public TransactionService(TransactionRepository transactionRepository,
                              CustomerRepository customerRepository,
                              TransactionMapper transactionMapper) {
        this.transactionRepository = transactionRepository;
        this.customerRepository = customerRepository;
        this.transactionMapper = transactionMapper;
    }

    @Transactional
    public TransactionDTO transferMoney(TransferRequestDTO transferRequest) {
        String senderAccountNumber = transferRequest.getSenderAccountNumber().trim();
        String receiverAccountNumber = transferRequest.getReceiverAccountNumber().trim();

        if (senderAccountNumber.equals(receiverAccountNumber)) {
            throw new BusinessRuleException("Sender and receiver accounts must be different");
        }

        Customer sender;
        Customer receiver;
        if (senderAccountNumber.compareTo(receiverAccountNumber) < 0) {
            sender = lockAccount(senderAccountNumber);
            receiver = lockAccount(receiverAccountNumber);
        } else {
            receiver = lockAccount(receiverAccountNumber);
            sender = lockAccount(senderAccountNumber);
        }

        BigDecimal amount = BigDecimal.valueOf(transferRequest.getAmount());
        BigDecimal senderBalance = BigDecimal.valueOf(sender.getBalance());
        if (senderBalance.compareTo(amount) < 0) {
            throw new BusinessRuleException("Insufficient funds in account " + senderAccountNumber);
        }

        sender.setBalance(senderBalance.subtract(amount).doubleValue());
        receiver.setBalance(BigDecimal.valueOf(receiver.getBalance()).add(amount).doubleValue());
        customerRepository.save(sender);
        customerRepository.save(receiver);

        Transaction transaction = new Transaction();
        transaction.setSenderAccountNumber(senderAccountNumber);
        transaction.setReceiverAccountNumber(receiverAccountNumber);
        transaction.setAmount(amount.doubleValue());
        transaction.setTimestamp(LocalDateTime.now());

        return transactionMapper.toDTO(transactionRepository.save(transaction));
    }

    @Transactional(readOnly = true)
    public List<TransactionDTO> getTransactionsForAccount(String accountNumber) {
        if (!customerRepository.existsByAccountNumber(accountNumber)) {
            throw new ResourceNotFoundException("Account " + accountNumber + " was not found");
        }
        return transactionRepository
                .findBySenderAccountNumberOrReceiverAccountNumberOrderByTimestampDescIdDesc(accountNumber, accountNumber)
                .stream()
                .map(transactionMapper::toDTO)
                .toList();
    }

    private Customer lockAccount(String accountNumber) {
        return customerRepository.findWithLockByAccountNumber(accountNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Account " + accountNumber + " was not found"));
    }
}
