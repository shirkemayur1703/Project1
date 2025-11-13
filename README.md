@echo off
echo ==========================================
echo Building and deploying React app to Tomcat
echo ==========================================

:: Step 1: Go to React project directory
cd /d D:\Workspace\MyReactApp

:: Step 2: Run the build script
echo.
echo --- Running build.bat ---
call build.bat
if errorlevel 1 (
    echo Build failed. Exiting.
    pause
    exit /b 1
)

:: Step 3: Clear old build files from Tomcat
echo.
echo --- Removing old build files from Tomcat ---
rmdir /s /q "D:\Tomcat\webapps\Common\React\build"
mkdir "D:\Tomcat\webapps\Common\React\build"

:: Step 4: Copy new build files to Tomcat
echo.
echo --- Copying new build files ---
xcopy /E /I /Y "D:\Workspace\MyReactApp\build" "D:\Tomcat\webapps\Common\React\build"

:: Step 5: Done
echo.
echo ✅ React app deployed successfully to Tomcat!
pause
import React, { useState } from "react";
import { X, Minus, MessageCircle } from "lucide-react";

const ChatbotPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { sender: "user", text: input.trim() };
    const botMsg = {
      sender: "bot",
      text: "This is a sample response. (Replace with backend call)",
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
  };

  if (!isOpen) {
    return (
      <button
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all"
        onClick={() => setIsOpen(true)}
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 sm:w-96 bg-white shadow-2xl border border-gray-200 rounded-2xl flex flex-col overflow-hidden transition-all">
      {/* Header */}
      <div className="flex justify-between items-center bg-blue-600 text-white px-4 py-2">
        <h2 className="font-semibold">Chatbot Assistant</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hover:text-gray-200 transition"
            title={isCollapsed ? "Expand" : "Minimize"}
          >
            <Minus size={18} />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="hover:text-gray-200 transition"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Collapsible Content */}
      {!isCollapsed && (
        <>
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-xl max-w-[80%] text-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center p-2 border-t bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm transition"
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatbotPanel;





                             
    

// UserAlreadyExistsException.java
package com.digitalwallet.core.exception;

public class UserAlreadyExistsException extends WalletException {
    public UserAlreadyExistsException(String message) {
        super(message);
    }
}

// InsufficientBalanceException.java
package com.digitalwallet.core.exception;

import java.math.BigDecimal;

public class InsufficientBalanceException extends WalletException {
    private final BigDecimal availableBalance;
    private final BigDecimal requestedAmount;

    public InsufficientBalanceException(BigDecimal availableBalance, BigDecimal requestedAmount) {
        super(String.format("Insufficient balance. Available: %s, Requested: %s", 
              availableBalance, requestedAmount));
        this.availableBalance = availableBalance;
        this.requestedAmount = requestedAmount;
    }

    public BigDecimal getAvailableBalance() { return availableBalance; }
    public BigDecimal getRequestedAmount() { return requestedAmount; }
}

// InvalidPinException.java
package com.digitalwallet.core.exception;

public class InvalidPinException extends WalletException {
    public InvalidPinException(String message) {
        super(message);
    }
}

// WalletNotFoundException.java
package com.digitalwallet.core.exception;

public class WalletNotFoundException extends WalletException {
    public WalletNotFoundException(String message) {
        super(message);
    }
}

// TransactionFailedException.java
package com.digitalwallet.core.exception;

public class TransactionFailedException extends WalletException {
    public TransactionFailedException(String message) {
        super(message);
    }

    public TransactionFailedException(String message, Throwable cause) {
        super(message, cause);
    }
}

// InvalidEmailException.java
package com.digitalwallet.core.exception;

public class InvalidEmailException extends WalletException {
    public InvalidEmailException(String message) {
        super(message);
    }
}

// MoneyRequestNotFoundException.java
package com.digitalwallet.core.exception;

public class MoneyRequestNotFoundException extends WalletException {
    public MoneyRequestNotFoundException(String message) {
        super(message);
    }
}

// ===== SERVICE CLASSES =====

// UserService.java
package com.digitalwallet.core.service;

import com.digitalwallet.core.model.User;
import com.digitalwallet.core.model.UserProfile;
import com.digitalwallet.core.exception.*;
import com.digitalwallet.persistent.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.util.regex.Pattern;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class UserService {
    private final UserRepository userRepository;
    private static final Pattern EMAIL_PATTERN = 
        Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User registerUser(String email, String password, String firstName, 
                           String lastName, String phoneNumber, String address) 
            throws UserAlreadyExistsException, InvalidEmailException {
        
        if (!isValidEmail(email)) {
            throw new InvalidEmailException("Invalid email format: " + email);
        }

        if (userRepository.findByEmail(email).isPresent()) {
            throw new UserAlreadyExistsException("User with email " + email + " already exists");
        }

        String userId = UUID.randomUUID().toString();
        String passwordHash = hashPassword(password);
        
        User user = new User(userId, email, passwordHash, LocalDateTime.now(), true);
        UserProfile profile = new UserProfile(userId, firstName, lastName, phoneNumber, address);
        
        userRepository.save(user);
        userRepository.saveProfile(profile);
        
        return user;
    }

    public Optional<User> loginUser(String email, String password) 
            throws InvalidEmailException {
        
        if (!isValidEmail(email)) {
            throw new InvalidEmailException("Invalid email format: " + email);
        }

        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.isActive() && verifyPassword(password, user.getPasswordHash())) {
                return userOpt;
            }
        }
        
        return Optional.empty();
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findUserById(String userId) {
        return userRepository.findById(userId);
    }

    public Optional<UserProfile> getUserProfile(String userId) {
        return userRepository.findProfileByUserId(userId);
    }

    private boolean isValidEmail(String email) {
        return email != null && EMAIL_PATTERN.matcher(email).matches();
    }

    private String hashPassword(String password) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(password.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private boolean verifyPassword(String password, String hash) {
        return hashPassword(password).equals(hash);
    }
}

// WalletService.java
package com.digitalwallet.core.service;

import com.digitalwallet.core.model.*;
import com.digitalwallet.core.exception.*;
import com.digitalwallet.persistent.repository.WalletRepository;
import com.digitalwallet.persistent.repository.TransactionRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

public class WalletService {
    private final WalletRepository walletRepository;
    private final TransactionRepository transactionRepository;

    public WalletService(WalletRepository walletRepository, TransactionRepository transactionRepository) {
        this.walletRepository = walletRepository;
        this.transactionRepository = transactionRepository;
    }

    public Wallet createWallet(String userId, String pin) throws WalletException {
        if (walletRepository.findByUserId(userId).isPresent()) {
            throw new WalletException("Wallet already exists for user: " + userId);
        }

        String walletId = UUID.randomUUID().toString();
        String pinHash = hashPin(pin);
        
        Wallet wallet = new Wallet(walletId, userId, BigDecimal.ZERO, pinHash, 
                                 LocalDateTime.now(), LocalDateTime.now(), true);
        
        return walletRepository.save(wallet);
    }

    public Wallet addMoney(String userId, BigDecimal amount, Transaction.PaymentMethod paymentMethod, 
                          String pin) throws WalletException {
        
        validateAmount(amount);
        Wallet wallet = getWalletByUserId(userId);
        validatePin(pin, wallet.getPinHash());

        // Create transaction record
        String transactionId = UUID.randomUUID().toString();
        Transaction transaction = new Transaction(
            transactionId, null, userId, amount, Transaction.Type.ADD_MONEY, 
            Transaction.Status.COMPLETED, paymentMethod, "Money added to wallet",
            LocalDateTime.now(), LocalDateTime.now(), null
        );
        
        transactionRepository.save(transaction);
        
        // Update wallet balance
        BigDecimal newBalance = wallet.getBalance().add(amount);
        Wallet updatedWallet = wallet.withBalance(newBalance);
        
        return walletRepository.save(updatedWallet);
    }

    public void sendMoney(String fromUserId, String toUserId, BigDecimal amount, 
                         String pin, String description) throws WalletException {
        
        validateAmount(amount);
        
        Wallet fromWallet = getWalletByUserId(fromUserId);
        Wallet toWallet = getWalletByUserId(toUserId);
        
        validatePin(pin, fromWallet.getPinHash());
        
        if (fromWallet.getBalance().compareTo(amount) < 0) {
            throw new InsufficientBalanceException(fromWallet.getBalance(), amount);
        }

        String transactionId = UUID.randomUUID().toString();
        
        try {
            // Deduct from sender
            BigDecimal newFromBalance = fromWallet.getBalance().subtract(amount);
            Wallet updatedFromWallet = fromWallet.withBalance(newFromBalance);
            walletRepository.save(updatedFromWallet);
            
            // Add to receiver
            BigDecimal newToBalance = toWallet.getBalance().add(amount);
            Wallet updatedToWallet = toWallet.withBalance(newToBalance);
            walletRepository.save(updatedToWallet);
            
            // Record transaction
            Transaction transaction = new Transaction(
                transactionId, fromUserId, toUserId, amount, Transaction.Type.SEND_MONEY,
                Transaction.Status.COMPLETED, Transaction.PaymentMethod.WALLET_TRANSFER,
                description, LocalDateTime.now(), LocalDateTime.now(), null
            );
            
            transactionRepository.save(transaction);
            
        } catch (Exception e) {
            // Record failed transaction
            Transaction failedTransaction = new Transaction(
                transactionId, fromUserId, toUserId, amount, Transaction.Type.SEND_MONEY,
                Transaction.Status.FAILED, Transaction.PaymentMethod.WALLET_TRANSFER,
                description, LocalDateTime.now(), null, e.getMessage()
            );
            
            transactionRepository.save(failedTransaction);
            throw new TransactionFailedException("Failed to send money: " + e.getMessage(), e);
        }
    }

    public Optional<Wallet> getWallet(String userId) {
        return walletRepository.findByUserId(userId);
    }

    public boolean changePin(String userId, String oldPin, String newPin) throws WalletException {
        Wallet wallet = getWalletByUserId(userId);
        
        if (!verifyPin(oldPin, wallet.getPinHash())) {
            throw new InvalidPinException("Invalid current PIN");
        }
        
        String newPinHash = hashPin(newPin);
        Wallet updatedWallet = wallet.withPinHash(newPinHash);
        walletRepository.save(updatedWallet);
        
        return true;
    }

    private Wallet getWalletByUserId(String userId) throws WalletNotFoundException {
        return walletRepository.findByUserId(userId)
            .orElseThrow(() -> new WalletNotFoundException("Wallet not found for user: " + userId));
    }

    private void validateAmount(BigDecimal amount) throws WalletException {
        if (amount == null || amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new WalletException("Amount must be positive");
        }
    }

    private void validatePin(String pin, String storedHash) throws InvalidPinException {
        if (!verifyPin(pin, storedHash)) {
            throw new InvalidPinException("Invalid PIN");
        }
    }

    private String hashPin(String pin) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] hashedBytes = md.digest(pin.getBytes());
            StringBuilder sb = new StringBuilder();
            for (byte b : hashedBytes) {
                sb.append(String.format("%02x", b));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private boolean verifyPin(String pin, String hash) {
        return hashPin(pin).equals(hash);
    }
}

// MoneyRequestService.java
package com.digitalwallet.core.service;

import com.digitalwallet.core.model.MoneyRequest;
import com.digitalwallet.core.exception.*;
import com.digitalwallet.persistent.repository.MoneyRequestRepository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public class MoneyRequestService {
    private final MoneyRequestRepository requestRepository;
    private final WalletService walletService;
    private final UserService userService;

    public MoneyRequestService(MoneyRequestRepository requestRepository, 
                             WalletService walletService, UserService userService) {
        this.requestRepository = requestRepository;
        this.walletService = walletService;
        this.userService = userService;
    }

    public MoneyRequest requestMoney(String fromUserId, String toUserEmail, 
                                   BigDecimal amount, String message) throws WalletException {
        
        // Validate recipient exists
        var toUser = userService.findUserByEmail(toUserEmail)
            .orElseThrow(() -> new UserNotFoundException("User with email " + toUserEmail + " not found"));

        String requestId = UUID.randomUUID().toString();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiresAt = now.plusDays(7); // Request expires in 7 days
        
        MoneyRequest request = new MoneyRequest(
            requestId, fromUserId, toUser.getUserId(), amount, message,
            MoneyRequest.Status.PENDING, now, null, expiresAt
        );
        
        return requestRepository.save(request);
    }

    public void fulfillMoneyRequest(String requestId, String pin) throws WalletException {
        MoneyRequest request = requestRepository.findById(requestId)
            .orElseThrow(() -> new MoneyRequestNotFoundException("Money request not found: " + requestId));
        
        if (request.getStatus() != MoneyRequest.Status.PENDING) {
            throw new WalletException("Money request is not pending");
        }
        
        if (request.isExpired()) {
            throw new WalletException("Money request has expired");
        }

        // Send money from the request target to the requester
        walletService.sendMoney(request.getToUserId(), request.getFromUserId(), 
                               request.getAmount(), pin, 
                               "Fulfilling money request: " + request.getMessage());
        
        // Update request status
        MoneyRequest fulfilledRequest = request.withStatus(MoneyRequest.Status.FULFILLED);
        requestRepository.save(fulfilledRequest);
    }

    public void rejectMoneyRequest(String requestId, String userId) throws WalletException {
        MoneyRequest request = requestRepository.findById(requestId)
            .orElseThrow(() -> new MoneyRequestNotFoundException("Money request not found: " + requestId));
        
        if (!request.getToUserId().equals(userId)) {
            throw new WalletException("User not authorized to reject this request");
        }
        
        if (request.getStatus() != MoneyRequest.Status.PENDING) {
            throw new WalletException("Money request is not pending");
        }

        MoneyRequest rejectedRequest = request.withStatus(MoneyRequest.Status.REJECTED);
        requestRepository.save(rejectedRequest);
    }

    public List<MoneyRequest> getIncomingRequests(String userId) {
        return requestRepository.findByToUserId(userId);
    }

    public List<MoneyRequest> getOutgoingRequests(String userId) {
        return requestRepository.findByFromUserId(userId);
    }
}

// TransactionService.java
package com.digitalwallet.core.service;

import com.digitalwallet.core.model.Transaction;
import com.digitalwallet.persistent.repository.TransactionRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public class TransactionService {
    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getUserTransactions(String userId) {
        return transactionRepository.findByUserId(userId);
    }

    public List<Transaction> getUserTransactionsByDateRange(String userId, 
                                                           LocalDateTime startDate, 
                                                           LocalDateTime endDate) {
        return transactionRepository.findByUserIdAndDateRange(userId, startDate, endDate);
    }

    public Optional<Transaction> getTransactionById(String transactionId) {
        return transactionRepository.findById(transactionId);
    }

    public List<Transaction> getRecentTransactions(String userId, int limit) {
        return transactionRepository.findRecentByUserId(userId, limit);
    }
}

// ===== PERSISTENT MODULE =====

// ===== REPOSITORY CLASSES =====

// UserRepository.java
package com.digitalwallet.persistent.repository;

import com.digitalwallet.core.model.User;
import com.digitalwallet.core.model.UserProfile;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class UserRepository {
    private final Map<String, User> usersById = new ConcurrentHashMap<>();
    private final Map<String, User> usersByEmail = new ConcurrentHashMap<>();
    private final Map<String, UserProfile> userProfiles = new ConcurrentHashMap<>();

    public User save(User user) {
        usersById.put(user.getUserId(), user);
        usersByEmail.put(user.getEmail(), user);
        return user;
    }

    public UserProfile saveProfile(UserProfile profile) {
        userProfiles.put(profile.getUserId(), profile);
        return profile;
    }

    public Optional<User> findById(String userId) {
        return Optional.ofNullable(usersById.get(userId));
    }

    public Optional<User> findByEmail(String email) {
        return Optional.ofNullable(usersByEmail.get(email));
    }

    public Optional<UserProfile> findProfileByUserId(String userId) {
        return Optional.ofNullable(userProfiles.get(userId));
    }

    public List<User> findAll() {
        return new ArrayList<>(usersById.values());
    }

    public boolean deleteById(String userId) {
        User user = usersById.remove(userId);
        if (user != null) {
            usersByEmail.remove(user.getEmail());
            userProfiles.remove(userId);
            return true;
        }
        return false;
    }

    public long count() {
        return usersById.size();
    }

    public boolean existsById(String userId) {
        return usersById.containsKey(userId);
    }

    public boolean existsByEmail(String email) {
        return usersByEmail.containsKey(email);
    }
}

// WalletRepository.java
package com.digitalwallet.persistent.repository;

import com.digitalwallet.core.model.Wallet;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

public class WalletRepository {
    private final Map<String, Wallet> walletsById = new ConcurrentHashMap<>();
    private final Map<String, Wallet> walletsByUserId = new ConcurrentHashMap<>();

    public Wallet save(Wallet wallet) {
        walletsById.put(wallet.getWalletId(), wallet);
        walletsByUserId.put(wallet.getUserId(), wallet);
        return wallet;
    }

    public Optional<Wallet> findById(String walletId) {
        return Optional.ofNullable(walletsById.get(walletId));
    }

    public Optional<Wallet> findByUserId(String userId) {
        return Optional.ofNullable(walletsByUserId.get(userId));
    }

    public List<Wallet> findAll() {
        return new ArrayList<>(walletsById.values());
    }

    public boolean deleteById(String walletId) {
        Wallet wallet = walletsById.remove(walletId);
        if (wallet != null) {
            walletsByUserId.remove(wallet.getUserId());
            return true;
        }
        return false;
    }

    public long count() {
        return walletsById.size();
    }

    public boolean existsById(String walletId) {
        return walletsById.containsKey(walletId);
    }

    public boolean existsByUserId(String userId) {
        return walletsByUserId.containsKey(userId);
    }
}

// TransactionRepository.java
package com.digitalwallet.persistent.repository;

import com.digitalwallet.core.model.Transaction;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class TransactionRepository {
    private final Map<String, Transaction> transactionsById = new ConcurrentHashMap<>();

    public Transaction save(Transaction transaction) {
        transactionsById.put(transaction.getTransactionId(), transaction);
        return transaction;
    }

    public Optional<Transaction> findById(String transactionId) {
        return Optional.ofNullable(transactionsById.get(transactionId));
    }

    public List<Transaction> findByUserId(String userId) {
        return transactionsById.values().stream()
            .filter(t -> userId.equals(t.getFromUserId()) || userId.equals(t.getToUserId()))
            .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<Transaction> findByFromUserId(String fromUserId) {
        return transactionsById.values().stream()
            .filter(t -> fromUserId.equals(t.getFromUserId()))
            .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<Transaction> findByToUserId(String toUserId) {
        return transactionsById.values().stream()
            .filter(t -> toUserId.equals(t.getToUserId()))
            .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<Transaction> findByUserIdAndDateRange(String userId, 
                                                     LocalDateTime startDate, 
                                                     LocalDateTime endDate) {
        return transactionsById.values().stream()
            .filter(t -> userId.equals(t.getFromUserId()) || userId.equals(t.getToUserId()))
            .filter(t -> !t.getCreatedAt().isBefore(startDate) && !t.getCreatedAt().isAfter(endDate))
            .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<Transaction> findRecentByUserId(String userId, int limit) {
        return transactionsById.values().stream()
            .filter(t -> userId.equals(t.getFromUserId()) || userId.equals(t.getToUserId()))
            .sorted((t1, t2) -> t2.getCreatedAt().compareTo(t1.getCreatedAt()))
            .limit(limit)
            .collect(Collectors.toList());
    }

    public List<Transaction> findAll() {
        return new ArrayList<>(transactionsById.values());
    }

    public boolean deleteById(String transactionId) {
        return transactionsById.remove(transactionId) != null;
    }

    public long count() {
        return transactionsById.size();
    }

    public boolean existsById(String transactionId) {
        return transactionsById.containsKey(transactionId);
    }
}

// MoneyRequestRepository.java
package com.digitalwallet.persistent.repository;

import com.digitalwallet.core.model.MoneyRequest;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class MoneyRequestRepository {
    private final Map<String, MoneyRequest> requestsById = new ConcurrentHashMap<>();

    public MoneyRequest save(MoneyRequest request) {
        requestsById.put(request.getRequestId(), request);
        return request;
    }

    public Optional<MoneyRequest> findById(String requestId) {
        return Optional.ofNullable(requestsById.get(requestId));
    }

    public List<MoneyRequest> findByFromUserId(String fromUserId) {
        return requestsById.values().stream()
            .filter(r -> fromUserId.equals(r.getFromUserId()))
            .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<MoneyRequest> findByToUserId(String toUserId) {
        return requestsById.values().stream()
            .filter(r -> toUserId.equals(r.getToUserId()))
            .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<MoneyRequest> findPendingByToUserId(String toUserId) {
        return requestsById.values().stream()
            .filter(r -> toUserId.equals(r.getToUserId()))
            .filter(r -> r.getStatus() == MoneyRequest.Status.PENDING)
            .filter(r -> !r.isExpired())
            .sorted((r1, r2) -> r2.getCreatedAt().compareTo(r1.getCreatedAt()))
            .collect(Collectors.toList());
    }

    public List<MoneyRequest> findAll() {
        return new ArrayList<>(requestsById.values());
    }

    public boolean deleteById(String requestId) {
        return requestsById.remove(requestId) != null;
    }

    public long count() {
        return requestsById.size();
    }

    public boolean existsById(String requestId) {
        return requestsById.containsKey(requestId);
    }
}

// ===== MAIN APPLICATION CLASS =====

// WalletApplication.java - Main application class demonstrating usage
package com.digitalwallet;

import com.digitalwallet.core.model.*;
import com.digitalwallet.core.service.*;
import com.digitalwallet.core.exception.*;
import com.digitalwallet.persistent.repository.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.Scanner;

public class WalletApplication {
    private final UserService userService;
    private final WalletService walletService;
    private final TransactionService transactionService;
    private final MoneyRequestService moneyRequestService;
    private final Scanner scanner;

    public WalletApplication() {
        // Initialize repositories
        UserRepository userRepository = new UserRepository();
        WalletRepository walletRepository = new WalletRepository();
        TransactionRepository transactionRepository = new TransactionRepository();
        MoneyRequestRepository moneyRequestRepository = new MoneyRequestRepository();

        // Initialize services
        this.userService = new UserService(userRepository);
        this.walletService = new WalletService(walletRepository, transactionRepository);
        this.transactionService = new TransactionService(transactionRepository);
        this.moneyRequestService = new MoneyRequestService(moneyRequestRepository, walletService, userService);
        
        this.scanner = new Scanner(System.in);
    }

    public static void main(String[] args) {
        WalletApplication app = new WalletApplication();
        app.run();
    }

    public void run() {
        System.out.println("=== Welcome to Digital Wallet Application ===");
        
        while (true) {
            showMainMenu();
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline
            
            try {
                switch (choice) {
                    case 1 -> registerUser();
                    case 2 -> loginUser();
                    case 3 -> {
                        System.out.println("Thank you for using Digital Wallet!");
                        return;
                    }
                    default -> System.out.println("Invalid choice. Please try again.");
                }
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private void showMainMenu() {
        System.out.println("\n=== Main Menu ===");
        System.out.println("1. Register");
        System.out.println("2. Login");
        System.out.println("3. Exit");
        System.out.print("Choose an option: ");
    }

    private void registerUser() {
        System.out.println("\n=== User Registration ===");
        
        System.out.print("Enter email: ");
        String email = scanner.nextLine();
        
        System.out.print("Enter password: ");
        String password = scanner.nextLine();
        
        System.out.print("Enter first name: ");
        String firstName = scanner.nextLine();
        
        System.out.print("Enter last name: ");
        String lastName = scanner.nextLine();
        
        System.out.print("Enter phone number: ");
        String phoneNumber = scanner.nextLine();
        
        System.out.print("Enter address: ");
        String address = scanner.nextLine();

        try {
            User user = userService.registerUser(email, password, firstName, lastName, phoneNumber, address);
            System.out.println("Registration successful! User ID: " + user.getUserId());
            
            // Create wallet for new user
            System.out.print("Set a 4-digit PIN for your wallet: ");
            String pin = scanner.nextLine();
            
            Wallet wallet = walletService.createWallet(user.getUserId(), pin);
            System.out.println("Wallet created successfully! Wallet ID: " + wallet.getWalletId());
            
        } catch (UserAlreadyExistsException | InvalidEmailException | WalletException e) {
            System.out.println("Registration failed: " + e.getMessage());
        }
    }

    private void loginUser() {
        System.out.println("\n=== User Login ===");
        
        System.out.print("Enter email: ");
        String email = scanner.nextLine();
        
        System.out.print("Enter password: ");
        String password = scanner.nextLine();

        try {
            Optional<User> userOpt = userService.loginUser(email, password);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                System.out.println("Login successful! Welcome back.");
                showUserMenu(user);
            } else {
                System.out.println("Invalid credentials. Please try again.");
            }
        } catch (InvalidEmailException e) {
            System.out.println("Login failed: " + e.getMessage());
        }
    }

    private void showUserMenu(User user) {
        while (true) {
            System.out.println("\n=== Wallet Menu ===");
            System.out.println("1. View Wallet Balance");
            System.out.println("2. Add Money");
            System.out.println("3. Send Money");
            System.out.println("4. Request Money");
            System.out.println("5. View Transaction History");
            System.out.println("6. View Money Requests");
            System.out.println("7. Change PIN");
            System.out.println("8. Logout");
            System.out.print("Choose an option: ");
            
            int choice = scanner.nextInt();
            scanner.nextLine(); // Consume newline
            
            try {
                switch (choice) {
                    case 1 -> viewWalletBalance(user);
                    case 2 -> addMoney(user);
                    case 3 -> sendMoney(user);
                    case 4 -> requestMoney(user);
                    case 5 -> viewTransactionHistory(user);
                    case 6 -> viewMoneyRequests(user);
                    case 7 -> changePin(user);
                    case 8 -> {
                        System.out.println("Logged out successfully.");
                        return;
                    }
                    default -> System.out.println("Invalid choice. Please try again.");
                }
            } catch (Exception e) {
                System.out.println("Error: " + e.getMessage());
            }
        }
    }

    private void viewWalletBalance(User user) {
        try {
            Optional<Wallet> walletOpt = walletService.getWallet(user.getUserId());
            if (walletOpt.isPresent()) {
                Wallet wallet = walletOpt.get();
                System.out.println("Current Balance: ₹" + wallet.getBalance());
            } else {
                System.out.println("Wallet not found. Please contact support.");
            }
        } catch (Exception e) {
            System.out.println("Error retrieving wallet: " + e.getMessage());
        }
    }

    private void addMoney(User user) {
        System.out.print("Enter amount to add: ₹");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // Consume newline
        
        System.out.println("Select payment method:");
        System.out.println("1. UPI");
        System.out.println("2. Credit Card");
        System.out.println("3. Debit Card");
        System.out.print("Choose: ");
        int methodChoice = scanner.nextInt();
        scanner.nextLine(); // Consume newline
        
        Transaction.PaymentMethod paymentMethod = switch (methodChoice) {
            case 1 -> Transaction.PaymentMethod.UPI;
            case 2 -> Transaction.PaymentMethod.CREDIT_CARD;
            case 3 -> Transaction.PaymentMethod.DEBIT_CARD;
            default -> {
                System.out.println("Invalid payment method.");
                yield null;
            }
        };
        
        if (paymentMethod == null) return;
        
        System.out.print("Enter your PIN: ");
        String pin = scanner.nextLine();

        try {
            Wallet updatedWallet = walletService.addMoney(user.getUserId(), amount, paymentMethod, pin);
            System.out.println("Money added successfully!");
            System.out.println("New Balance: ₹" + updatedWallet.getBalance());
        } catch (WalletException e) {
            System.out.println("Failed to add money: " + e.getMessage());
        }
    }

    private void sendMoney(User user) {
        System.out.print("Enter recipient's email: ");
        String recipientEmail = scanner.nextLine();
        
        System.out.print("Enter amount to send: ₹");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // Consume newline
        
        System.out.print("Enter description (optional): ");
        String description = scanner.nextLine();
        
        System.out.print("Enter your PIN: ");
        String pin = scanner.nextLine();

        try {
            Optional<User> recipientOpt = userService.findUserByEmail(recipientEmail);
            if (recipientOpt.isEmpty()) {
                System.out.println("Recipient not found with email: " + recipientEmail);
                return;
            }
            
            walletService.sendMoney(user.getUserId(), recipientOpt.get().getUserId(), amount, pin, description);
            System.out.println("Money sent successfully to " + recipientEmail);
            
        } catch (WalletException e) {
            System.out.println("Failed to send money: " + e.getMessage());
        }
    }

    private void requestMoney(User user) {
        System.out.print("Enter email of person to request money from: ");
        String fromEmail = scanner.nextLine();
        
        System.out.print("Enter amount to request: ₹");
        BigDecimal amount = scanner.nextBigDecimal();
        scanner.nextLine(); // Consume newline
        
        System.out.print("Enter message (optional): ");
        String message = scanner.nextLine();

        try {
            MoneyRequest request = moneyRequestService.requestMoney(user.getUserId(), fromEmail, amount, message);
            System.out.println("Money request sent successfully!");
            System.out.println("Request ID: " + request.getRequestId());
        } catch (WalletException e) {
            System.out.println("Failed to send money request: " + e.getMessage());
        }
    }

    private void viewTransactionHistory(User user) {
        System.out.println("\n=== Transaction History ===");
        List<Transaction> transactions = transactionService.getUserTransactions(user.getUserId());
        
        if (transactions.isEmpty()) {
            System.out.println("No transactions found.");
            return;
        }

        for (Transaction transaction : transactions) {
            System.out.println("---");
            System.out.println("ID: " + transaction.getTransactionId());
            System.out.println("Type: " + transaction.getType());
            System.out.println("Amount: ₹" + transaction.getAmount());
            System.out.println("Status: " + transaction.getStatus());
            System.out.println("Date: " + transaction.getCreatedAt());
            if (transaction.getDescription() != null) {
                System.out.println("Description: " + transaction.getDescription());
            }
        }
    }

    private void viewMoneyRequests(User user) {
        System.out.println("\n=== Money Requests ===");
        System.out.println("1. Incoming Requests");
        System.out.println("2. Outgoing Requests");
        System.out.print("Choose: ");
        
        int choice = scanner.nextInt();
        scanner.nextLine(); // Consume newline
        
        if (choice == 1) {
            viewIncomingRequests(user);
        } else if (choice == 2) {
            viewOutgoingRequests(user);
        } else {
            System.out.println("Invalid choice.");
        }
    }

    private void viewIncomingRequests(User user) {
        List<MoneyRequest> requests = moneyRequestService.getIncomingRequests(user.getUserId());
        
        if (requests.isEmpty()) {
            System.out.println("No incoming money requests.");
            return;
        }

        System.out.println("\n=== Incoming Money Requests ===");
        for (MoneyRequest request : requests) {
            if (request.getStatus() == MoneyRequest.Status.PENDING && !request.isExpired()) {
                System.out.println("---");
                System.out.println("Request ID: " + request.getRequestId());
                System.out.println("Amount: ₹" + request.getAmount());
                System.out.println("Message: " + (request.getMessage() != null ? request.getMessage() : "N/A"));
                System.out.println("Date: " + request.getCreatedAt());
                
                System.out.print("Do you want to fulfill this request? (y/n): ");
                String response = scanner.nextLine();
                
                if ("y".equalsIgnoreCase(response)) {
                    System.out.print("Enter your PIN: ");
                    String pin = scanner.nextLine();
                    
                    try {
                        moneyRequestService.fulfillMoneyRequest(request.getRequestId(), pin);
                        System.out.println("Money request fulfilled successfully!");
                    } catch (WalletException e) {
                        System.out.println("Failed to fulfill request: " + e.getMessage());
                    }
                }
            }
        }
    }

    private void viewOutgoingRequests(User user) {
        List<MoneyRequest> requests = moneyRequestService.getOutgoingRequests(user.getUserId());
        
        if (requests.isEmpty()) {
            System.out.println("No outgoing money requests.");
            return;
        }

        System.out.println("\n=== Outgoing Money Requests ===");
        for (MoneyRequest request : requests) {
            System.out.println("---");
            System.out.println("Request ID: " + request.getRequestId());
            System.out.println("Amount: ₹" + request.getAmount());
            System.out.println("Status: " + request.getStatus());
            System.out.println("Message: " + (request.getMessage() != null ? request.getMessage() : "N/A"));
            System.out.println("Date: " + request.getCreatedAt());
            if (request.isExpired()) {
                System.out.println("Status: EXPIRED");
            }
        }
    }

    private void changePin(User user) {
        System.out.print("Enter current PIN: ");
        String oldPin = scanner.nextLine();
        
        System.out.print("Enter new PIN: ");
        String newPin = scanner.nextLine();
        
        System.out.print("Confirm new PIN: ");
        String confirmPin = scanner.nextLine();
        
        if (!newPin.equals(confirmPin)) {
            System.out.println("PINs do not match. Please try again.");
            return;
        }

        try {
            boolean success = walletService.changePin(user.getUserId(), oldPin, newPin);
            if (success) {
                System.out.println("PIN changed successfully!");
            }
        } catch (WalletException e) {
            System.out.println("Failed to change PIN: " + e.getMessage());
        }
    }
}
