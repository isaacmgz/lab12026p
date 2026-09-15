package com.udea.lab12026p.controller;

import com.udea.lab12026p.dto.TransactionDTO;
import com.udea.lab12026p.dto.TransferRequestDTO;
import com.udea.lab12026p.exception.BusinessRuleException;
import com.udea.lab12026p.service.TransactionService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(TransactionController.class)
class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TransactionService transactionService;

    @Test
    void transferRejectsNegativeAmountWithValidationProblem() throws Exception {
        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senderAccountNumber":"1001","receiverAccountNumber":"1002","amount":-50}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Validation failed"))
                .andExpect(jsonPath("$.errors.amount").value("Amount must be greater than zero"));

        verifyNoInteractions(transactionService);
    }

    @Test
    void transferMapsBusinessRuleViolationToUnprocessableEntity() throws Exception {
        when(transactionService.transferMoney(any(TransferRequestDTO.class)))
                .thenThrow(new BusinessRuleException("Insufficient funds in account 1001"));

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senderAccountNumber":"1001","receiverAccountNumber":"1002","amount":900}
                                """))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.title").value("Business rule violation"))
                .andExpect(jsonPath("$.detail").value("Insufficient funds in account 1001"));
    }

    @Test
    void transferReturnsCreatedTransaction() throws Exception {
        TransactionDTO created = new TransactionDTO(7L, "1001", "1002", 25.5, LocalDateTime.of(2026, 9, 15, 10, 30));
        when(transactionService.transferMoney(any(TransferRequestDTO.class))).thenReturn(created);

        mockMvc.perform(post("/api/transactions")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"senderAccountNumber":"1001","receiverAccountNumber":"1002","amount":25.5}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.amount").value(25.5))
                .andExpect(jsonPath("$.timestamp").value("2026-09-15T10:30:00"));
    }
}
