package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.TransactionDTO;
import com.udea.lab12026p.dto.TransferRequestDTO;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.entity.Transaction;
import com.udea.lab12026p.exception.BusinessRuleException;
import com.udea.lab12026p.exception.ResourceNotFoundException;
import com.udea.lab12026p.mapper.TransactionMapperImpl;
import com.udea.lab12026p.repository.CustomerRepository;
import com.udea.lab12026p.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CustomerRepository customerRepository;

    private TransactionService transactionService;

    @BeforeEach
    void setUp() {
        transactionService = new TransactionService(transactionRepository, customerRepository, new TransactionMapperImpl());
    }

    @Test
    void transferMovesBalancesAndRecordsTransactionWithServerTimestamp() {
        Customer sender = new Customer(1L, "1001", "Ana", "Diaz", 500.0);
        Customer receiver = new Customer(2L, "1002", "Luis", "Rojas", 100.0);
        when(customerRepository.findWithLockByAccountNumber("1001")).thenReturn(Optional.of(sender));
        when(customerRepository.findWithLockByAccountNumber("1002")).thenReturn(Optional.of(receiver));
        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> {
            Transaction saved = invocation.getArgument(0);
            saved.setId(10L);
            return saved;
        });

        TransactionDTO result = transactionService.transferMoney(new TransferRequestDTO("1001", "1002", 120.35));

        assertThat(sender.getBalance()).isEqualTo(379.65);
        assertThat(receiver.getBalance()).isEqualTo(220.35);
        ArgumentCaptor<Transaction> captor = ArgumentCaptor.forClass(Transaction.class);
        verify(transactionRepository).save(captor.capture());
        assertThat(captor.getValue().getTimestamp()).isNotNull();
        assertThat(result.getId()).isEqualTo(10L);
        assertThat(result.getSenderAccountNumber()).isEqualTo("1001");
        assertThat(result.getReceiverAccountNumber()).isEqualTo("1002");
        assertThat(result.getAmount()).isEqualTo(120.35);
        assertThat(result.getTimestamp()).isNotNull();
    }

    @Test
    void transferRejectsSameSenderAndReceiver() {
        assertThatThrownBy(() -> transactionService.transferMoney(new TransferRequestDTO("1001", "1001", 10.0)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Sender and receiver accounts must be different");

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void transferRejectsInsufficientFunds() {
        Customer sender = new Customer(1L, "1001", "Ana", "Diaz", 50.0);
        Customer receiver = new Customer(2L, "1002", "Luis", "Rojas", 100.0);
        when(customerRepository.findWithLockByAccountNumber("1001")).thenReturn(Optional.of(sender));
        when(customerRepository.findWithLockByAccountNumber("1002")).thenReturn(Optional.of(receiver));

        assertThatThrownBy(() -> transactionService.transferMoney(new TransferRequestDTO("1001", "1002", 50.01)))
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Insufficient funds in account 1001");

        assertThat(sender.getBalance()).isEqualTo(50.0);
        assertThat(receiver.getBalance()).isEqualTo(100.0);
        verify(transactionRepository, never()).save(any());
    }

    @Test
    void transferRejectsMissingAccount() {
        Customer sender = new Customer(1L, "1001", "Ana", "Diaz", 500.0);
        when(customerRepository.findWithLockByAccountNumber("1001")).thenReturn(Optional.of(sender));
        when(customerRepository.findWithLockByAccountNumber("9999")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> transactionService.transferMoney(new TransferRequestDTO("1001", "9999", 10.0)))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Account 9999 was not found");

        assertThat(sender.getBalance()).isEqualTo(500.0);
        verify(transactionRepository, never()).save(any());
    }
}
