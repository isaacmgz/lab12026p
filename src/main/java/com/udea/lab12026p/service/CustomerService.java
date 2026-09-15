package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.CustomerDTO;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.exception.ConflictException;
import com.udea.lab12026p.exception.ResourceNotFoundException;
import com.udea.lab12026p.mapper.CustomerMapper;
import com.udea.lab12026p.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository, CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.customerMapper = customerMapper;
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        return customerRepository.findById(id).map(customerMapper::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + id + " was not found"));
    }

    @Transactional
    public CustomerDTO createCustomer(CustomerDTO customerDTO) {
        String accountNumber = customerDTO.getAccountNumber().trim();
        if (customerRepository.existsByAccountNumber(accountNumber)) {
            throw new ConflictException("Account number " + accountNumber + " is already in use");
        }

        Customer customer = customerMapper.toEntity(customerDTO);
        customer.setId(null);
        customer.setAccountNumber(accountNumber);
        customer.setFirstName(customerDTO.getFirstName().trim());
        customer.setLastName(customerDTO.getLastName().trim());
        return customerMapper.toDTO(customerRepository.save(customer));
    }
}
