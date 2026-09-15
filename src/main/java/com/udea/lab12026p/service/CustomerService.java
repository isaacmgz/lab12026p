package com.udea.lab12026p.service;

import com.udea.lab12026p.dto.CustomerDTO;
import com.udea.lab12026p.dto.UpdateCustomerRequest;
import com.udea.lab12026p.entity.Customer;
import com.udea.lab12026p.exception.ConflictException;
import com.udea.lab12026p.exception.ResourceNotFoundException;
import com.udea.lab12026p.mapper.CustomerMapper;
import com.udea.lab12026p.repository.CustomerRepository;
import com.udea.lab12026p.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CustomerService {
    private final CustomerRepository customerRepository;
    private final TransactionRepository transactionRepository;
    private final CustomerMapper customerMapper;

    public CustomerService(CustomerRepository customerRepository,
                           TransactionRepository transactionRepository,
                           CustomerMapper customerMapper) {
        this.customerRepository = customerRepository;
        this.transactionRepository = transactionRepository;
        this.customerMapper = customerMapper;
    }

    @Transactional(readOnly = true)
    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public CustomerDTO getCustomerById(Long id) {
        return customerMapper.toDTO(findCustomer(id));
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

    @Transactional
    public CustomerDTO updateCustomer(Long id, UpdateCustomerRequest updateRequest) {
        Customer customer = findCustomer(id);
        customer.setFirstName(updateRequest.getFirstName().trim());
        customer.setLastName(updateRequest.getLastName().trim());
        return customerMapper.toDTO(customerRepository.save(customer));
    }

    @Transactional
    public void deleteCustomer(Long id) {
        Customer customer = findCustomer(id);
        String accountNumber = customer.getAccountNumber();
        if (transactionRepository.existsBySenderAccountNumberOrReceiverAccountNumber(accountNumber, accountNumber)) {
            throw new ConflictException("Customer with transactions cannot be deleted");
        }
        customerRepository.delete(customer);
    }

    private Customer findCustomer(Long id) {
        return customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Customer with id " + id + " was not found"));
    }
}
