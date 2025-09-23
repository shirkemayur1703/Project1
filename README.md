Got it ✅ You want a modular digital wallet application in Java with a Core module (models, services, exceptions) and a Persistent module (repositories using in-memory collections). You also want immutability for classes like User and Transaction, and custom exceptions for business rules (e.g., insufficient balance, invalid PIN).

Here’s a suggested project structure and example code:


---

📂 Project Structure

digital-wallet/
│── core/
│   ├── model/
│   │   ├── User.java
│   │   ├── UserProfile.java
│   │   ├── Wallet.java
│   │   └── Transaction.java
│   │
│   ├── service/
│   │   ├── UserService.java
│   │   ├── WalletService.java
│   │   └── TransactionService.java
│   │
│   └── exception/
│       ├── InsufficientBalanceException.java
│       ├── InvalidPinException.java
│       └── UserNotFoundException.java
│
│── persistent/
│   └── repository/
│       ├── UserRepository.java
│       ├── WalletRepository.java
│       └── TransactionRepository.java
│
└── App.java   (main entry point for demo/testing)


---

📌 Core Module

1. Model Classes (Immutable where required)

User.java

package core.model;

import java.util.Objects;

public final class User {
    private final String userId;
    private final String email;
    private final String pin;
    private final UserProfile profile;

    public User(String userId, String email, String pin, UserProfile profile) {
        this.userId = Objects.requireNonNull(userId);
        this.email = Objects.requireNonNull(email);
        this.pin = Objects.requireNonNull(pin);
        this.profile = Objects.requireNonNull(profile);
    }

    public String getUserId() { return userId; }
    public String getEmail() { return email; }
    public String getPin() { return pin; }
    public UserProfile getProfile() { return profile; }
}

UserProfile.java

package core.model;

public class UserProfile {
    private String name;
    private String phone;

    public UserProfile(String name, String phone) {
        this.name = name;
        this.phone = phone;
    }

    public String getName() { return name; }
    public String getPhone() { return phone; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
}

Wallet.java

package core.model;

import java.math.BigDecimal;

public class Wallet {
    private final String walletId;
    private BigDecimal balance;

    public Wallet(String walletId) {
        this.walletId = walletId;
        this.balance = BigDecimal.ZERO;
    }

    public String getWalletId() { return walletId; }
    public BigDecimal getBalance() { return balance; }

    public void addMoney(BigDecimal amount) {
        balance = balance.add(amount);
    }

    public void deductMoney(BigDecimal amount) {
        balance = balance.subtract(amount);
    }
}

Transaction.java

package core.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Objects;

public final class Transaction {
    private final String transactionId;
    private final String senderId;
    private final String receiverId;
    private final BigDecimal amount;
    private final LocalDateTime timestamp;

    public Transaction(String transactionId, String senderId, String receiverId, BigDecimal amount) {
        this.transactionId = Objects.requireNonNull(transactionId);
        this.senderId = Objects.requireNonNull(senderId);
        this.receiverId = Objects.requireNonNull(receiverId);
        this.amount = Objects.requireNonNull(amount);
        this.timestamp = LocalDateTime.now();
    }

    public String getTransactionId() { return transactionId; }
    public String getSenderId() { return senderId; }
    public String getReceiverId() { return receiverId; }
    public BigDecimal getAmount() { return amount; }
    public LocalDateTime getTimestamp() { return timestamp; }
}


---

2. Exceptions

package core.exception;

public class InsufficientBalanceException extends RuntimeException {
    public InsufficientBalanceException(String message) {
        super(message);
    }
}

package core.exception;

public class InvalidPinException extends RuntimeException {
    public InvalidPinException(String message) {
        super(message);
    }
}

package core.exception;

public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String message) {
        super(message);
    }
}


---

3. Services

UserService.java

package core.service;

import core.exception.UserNotFoundException;
import core.model.User;
import persistent.repository.UserRepository;

public class UserService {
    private final UserRepository userRepository = new UserRepository();

    public void registerUser(User user) {
        userRepository.save(user);
    }

    public User login(String email, String pin) {
        return userRepository.findByEmail(email)
                .filter(u -> u.getPin().equals(pin))
                .orElseThrow(() -> new UserNotFoundException("Invalid email or pin"));
    }
}

WalletService.java

package core.service;

import core.exception.InsufficientBalanceException;
import core.model.Wallet;
import persistent.repository.WalletRepository;

import java.math.BigDecimal;

public class WalletService {
    private final WalletRepository walletRepository = new WalletRepository();

    public void addMoney(String walletId, BigDecimal amount) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        wallet.addMoney(amount);
    }

    public void deductMoney(String walletId, BigDecimal amount) {
        Wallet wallet = walletRepository.findById(walletId)
                .orElseThrow(() -> new RuntimeException("Wallet not found"));
        if (wallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException("Not enough balance!");
        }
        wallet.deductMoney(amount);
    }
}

TransactionService.java

package core.service;

import core.model.Transaction;
import persistent.repository.TransactionRepository;

import java.math.BigDecimal;
import java.util.UUID;

public class TransactionService {
    private final TransactionRepository transactionRepository = new TransactionRepository();
    private final WalletService walletService = new WalletService();

    public Transaction sendMoney(String senderWalletId, String receiverWalletId, BigDecimal amount) {
        walletService.deductMoney(senderWalletId, amount);
        walletService.addMoney(receiverWalletId, amount);

        Transaction txn = new Transaction(UUID.randomUUID().toString(), senderWalletId, receiverWalletId, amount);
        transactionRepository.save(txn);
        return txn;
    }
}


---

📌 Persistent Module

UserRepository.java

package persistent.repository;

import core.model.User;
import java.util.*;

public class UserRepository {
    private final Map<String, User> users = new HashMap<>();

    public void save(User user) {
        users.put(user.getUserId(), user);
    }

    public Optional<User> findByEmail(String email) {
        return users.values().stream().filter(u -> u.getEmail().equals(email)).findFirst();
    }
}

WalletRepository.java

package persistent.repository;

import core.model.Wallet;
import java.util.*;

public class WalletRepository {
    private final Map<String, Wallet> wallets = new HashMap<>();

    public void save(Wallet wallet) {
        wallets.put(wallet.getWalletId(), wallet);
    }

    public Optional<Wallet> findById(String walletId) {
        return Optional.ofNullable(wallets.get(walletId));
    }
}

TransactionRepository.java

package persistent.repository;

import core.model.Transaction;
import java.util.*;

public class TransactionRepository {
    private final List<Transaction> transactions = new ArrayList<>();

    public void save(Transaction txn) {
        transactions.add(txn);
    }

    public List<Transaction> findAll() {
        return Collections.unmodifiableList(transactions);
    }
}


---

📌 Example Main Class (App.java)

import core.model.*;
import core.service.*;

import java.math.BigDecimal;
import java.util.UUID;

public class App {
    public static void main(String[] args) {
        UserService userService = new UserService();
        WalletService walletService = new WalletService();
        TransactionService transactionService = new TransactionService();

        // Register users
        User u1 = new User(UUID.randomUUID().toString(), "alice@example.com", "1234",
                new UserProfile("Alice", "9999999999"));
        User u2 = new User(UUID.randomUUID().toString(), "bob@example.com", "5678",
                new UserProfile("Bob", "8888888888"));

        userService.registerUser(u1);
        userService.registerUser(u2);

        // Create wallets
        Wallet w1 = new Wallet(u1.getUserId());
        Wallet w2 = new Wallet(u2.getUserId());

        walletService.addMoney(w1.getWalletId(), new BigDecimal("1000"));
        walletService.addMoney(w2.getWalletId(), new BigDecimal("500"));

        // Send money
        Transaction txn = transactionService.sendMoney(w1.getWalletId(), w2.getWalletId(), new BigDecimal("200"));
        System.out.println("Transaction successful: " + txn.getTransactionId());
    }
}


---

👉 This setup is modular, clean, and extensible.

User and Transaction are immutable.

Repositories act as an in-memory DB.

Services contain business logic.

Exceptions handle edge cases cleanly.


Would you like me to also add Request Money feature (where one user can request from another and the other has to approve) in this structure?

