package com.udea.lab12026p.controller;

import com.udea.lab12026p.dto.CustomerDTO;
import com.udea.lab12026p.dto.UpdateCustomerRequest;
import com.udea.lab12026p.exception.ConflictException;
import com.udea.lab12026p.exception.ResourceNotFoundException;
import com.udea.lab12026p.service.CustomerService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(CustomerController.class)
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private CustomerService customerService;

    @Test
    void getCustomerByIdReturnsProblemDetailWhenCustomerDoesNotExist() throws Exception {
        when(customerService.getCustomerById(99L))
                .thenThrow(new ResourceNotFoundException("Customer with id 99 was not found"));

        mockMvc.perform(get("/api/customers/99"))
                .andExpect(status().isNotFound())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.title").value("Resource not found"))
                .andExpect(jsonPath("$.detail").value("Customer with id 99 was not found"));
    }

    @Test
    void createCustomerReturnsCreatedWithLocation() throws Exception {
        when(customerService.createCustomer(any(CustomerDTO.class)))
                .thenReturn(new CustomerDTO(3L, "Ana", "Diaz", "1001", 250.0));

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Ana","lastName":"Diaz","accountNumber":"1001","balance":250}
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "http://localhost/api/customers/3"))
                .andExpect(jsonPath("$.id").value(3))
                .andExpect(jsonPath("$.accountNumber").value("1001"));
    }

    @Test
    void createCustomerReturnsValidationErrorsPerField() throws Exception {
        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":" ","lastName":"Diaz","accountNumber":"12a","balance":-1}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Validation failed"))
                .andExpect(jsonPath("$.detail").value("One or more fields are invalid."))
                .andExpect(jsonPath("$.errors.firstName").value("First name is required"))
                .andExpect(jsonPath("$.errors.accountNumber").value("Account number must contain 4 to 20 digits"))
                .andExpect(jsonPath("$.errors.balance").value("Initial balance cannot be negative"));

        verifyNoInteractions(customerService);
    }

    @Test
    void createCustomerMapsDuplicateAccountToConflict() throws Exception {
        when(customerService.createCustomer(any(CustomerDTO.class)))
                .thenThrow(new ConflictException("Account number 1001 is already in use"));

        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Ana","lastName":"Diaz","accountNumber":"1001","balance":0}
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.title").value("Conflict"))
                .andExpect(jsonPath("$.detail").value("Account number 1001 is already in use"));
    }

    @Test
    void updateCustomerReturnsUpdatedCustomer() throws Exception {
        when(customerService.updateCustomer(eq(3L), any(UpdateCustomerRequest.class)))
                .thenReturn(new CustomerDTO(3L, "Ana Maria", "Lopez", "1001", 250.0));

        mockMvc.perform(put("/api/customers/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Ana Maria","lastName":"Lopez"}
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana Maria"))
                .andExpect(jsonPath("$.lastName").value("Lopez"));
    }

    @Test
    void updateCustomerValidatesNames() throws Exception {
        mockMvc.perform(put("/api/customers/3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"","lastName":"%s"}
                                """.formatted("x".repeat(51))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.firstName").value("First name is required"))
                .andExpect(jsonPath("$.errors.lastName").value("Last name must be at most 50 characters"));

        verifyNoInteractions(customerService);
    }

    @Test
    void deleteCustomerReturnsNoContent() throws Exception {
        mockMvc.perform(delete("/api/customers/3"))
                .andExpect(status().isNoContent());

        verify(customerService).deleteCustomer(3L);
    }

    @Test
    void deleteCustomerWithTransactionsReturnsConflict() throws Exception {
        doThrow(new ConflictException("Customer with transactions cannot be deleted"))
                .when(customerService).deleteCustomer(3L);

        mockMvc.perform(delete("/api/customers/3"))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.detail").value("Customer with transactions cannot be deleted"));
    }

    @Test
    void createCustomerReturnsBadRequestWhenBodyIsMalformed() throws Exception {
        mockMvc.perform(post("/api/customers")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"firstName\":"))
                .andExpect(status().isBadRequest())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_PROBLEM_JSON))
                .andExpect(jsonPath("$.title").value("Malformed request body"));
    }
}
