package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.CustomerDTO;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.exception.ConflictException;
import com.udea.lab12026p.exception.ResourceNotFoundException;
import com.udea.lab12026p.mapper.CustomerMapperImpl;
import com.udea.lab12026p.repository.CustomerRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomerServiceTest {

    @Mock
    private CustomerRepository customerRepository;

    private CustomerService customerService;

    @BeforeEach
    void setUp() {
        customerService = new CustomerService(customerRepository, new CustomerMapperImpl());
    }

    @Test
    void createCustomerIgnoresClientIdAndTrimsFields() {
        AtomicReference<Long> idAtSave = new AtomicReference<>(-1L);
        when(customerRepository.existsByAccountNumber("1001")).thenReturn(false);
        when(customerRepository.save(any(Customer.class))).thenAnswer(invocation -> {
            Customer saved = invocation.getArgument(0);
            idAtSave.set(saved.getId());
            saved.setId(5L);
            return saved;
        });

        CustomerDTO result = customerService.createCustomer(new CustomerDTO(1L, "  Ana ", " Diaz  ", "1001", 250.0));

        ArgumentCaptor<Customer> captor = ArgumentCaptor.forClass(Customer.class);
        verify(customerRepository).save(captor.capture());
        Customer persisted = captor.getValue();
        assertThat(idAtSave.get()).isNull();
        assertThat(persisted.getFirstName()).isEqualTo("Ana");
        assertThat(persisted.getLastName()).isEqualTo("Diaz");
        assertThat(persisted.getBalance()).isEqualTo(250.0);
        assertThat(result.getId()).isEqualTo(5L);
        assertThat(result.getAccountNumber()).isEqualTo("1001");
    }

    @Test
    void createCustomerRejectsDuplicateAccountNumber() {
        when(customerRepository.existsByAccountNumber("1001")).thenReturn(true);

        assertThatThrownBy(() -> customerService.createCustomer(new CustomerDTO(null, "Ana", "Diaz", "1001", 10.0)))
                .isInstanceOf(ConflictException.class)
                .hasMessage("Account number 1001 is already in use");

        verify(customerRepository, never()).save(any());
    }

    @Test
    void getCustomerByIdThrowsWhenMissing() {
        when(customerRepository.findById(42L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> customerService.getCustomerById(42L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessage("Customer with id 42 was not found");
    }
}
