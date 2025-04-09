// Current balance (simulated)
let balance = 1000.00;
let currentPin = '1234'; // Default PIN for demo
let transactions = [
    {
        date: new Date().toLocaleString(),
        type: 'Initial Balance',
        amount: 1000.00,
        balance: 1000.00
    }
];

// Initialize all event listeners when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // PIN input handling
    document.querySelectorAll('.number-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const pinInput = document.getElementById('pin-input');
            if (pinInput.value.length < 4) {
                pinInput.value += this.textContent;
            }
        });
    });

    // Quick amount buttons
    document.querySelectorAll('.quick-amount').forEach(btn => {
        btn.addEventListener('click', function() {
            const amount = this.textContent.replace('$', '');
            const activeScreen = document.querySelector('.screen.active').id;
            
            if (activeScreen === 'withdraw-screen') {
                document.getElementById('withdraw-amount').value = amount;
            } else if (activeScreen === 'deposit-screen') {
                document.getElementById('deposit-amount').value = amount;
            } else if (activeScreen === 'services-screen') {
                document.getElementById('service-amount').value = amount;
            }
        });
    });
});

// Show a specific screen and hide others
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

function clearPin() {
    document.getElementById('pin-input').value = '';
}

function deletePin() {
    const pinInput = document.getElementById('pin-input');
    pinInput.value = pinInput.value.slice(0, -1);
}

// Login function
function login() {
    const enteredPin = document.getElementById('pin-input').value;
    if (enteredPin.length !== 4) {
        alert('Please enter a 4-digit PIN');
        return;
    }
    
    if (enteredPin === currentPin) {
        showScreen('menu-screen');
        updateBalanceDisplay();
    } else {
        alert('Incorrect PIN. Try again.');
        clearPin();
    }
}

// Logout function
function logout() {
    showScreen('login-screen');
    clearPin();
}

// Quick amount buttons
document.querySelectorAll('.quick-amount').forEach(btn => {
    btn.addEventListener('click', function() {
        const amount = this.textContent.replace('$', '');
        const activeScreen = document.querySelector('.screen.active').id;
        
        if (activeScreen === 'withdraw-screen') {
            document.getElementById('withdraw-amount').value = amount;
        } else if (activeScreen === 'deposit-screen') {
            document.getElementById('deposit-amount').value = amount;
        } else if (activeScreen === 'services-screen') {
            document.getElementById('service-amount').value = amount;
        }
    });
});

// Update balance display
function updateBalanceDisplay() {
    document.getElementById('balance-display').textContent = `$${balance.toFixed(2)}`;
}

// Process withdrawal
function processWithdrawal() {
    const amount = parseFloat(document.getElementById('withdraw-amount').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (amount > balance) {
        alert('Insufficient funds');
        return;
    }
    
    balance -= amount;
    transactions.push({
        date: new Date().toLocaleString(),
        type: 'Withdrawal',
        amount: -amount,
        balance: balance
    });
    document.getElementById('transaction-title').textContent = 'Withdrawal Complete';
    document.getElementById('transaction-message').textContent = `You have withdrawn $${amount.toFixed(2)}`;
    document.getElementById('new-balance').textContent = `$${balance.toFixed(2)}`;
    showScreen('transaction-screen');
    updateBalanceDisplay();
}

// Process deposit
function processDeposit() {
    const amount = parseFloat(document.getElementById('deposit-amount').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    balance += amount;
    transactions.push({
        date: new Date().toLocaleString(),
        type: 'Deposit',
        amount: amount,
        balance: balance
    });
    document.getElementById('transaction-title').textContent = 'Deposit Complete';
    document.getElementById('transaction-message').textContent = `You have deposited $${amount.toFixed(2)}`;
    document.getElementById('new-balance').textContent = `$${balance.toFixed(2)}`;
    showScreen('transaction-screen');
    updateBalanceDisplay();
}

// Process service payment
function processServicePayment() {
    const service = document.getElementById('service-select').value;
    const amount = parseFloat(document.getElementById('service-amount').value);
    
    if (!service) {
        alert('Please select a service');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }
    
    if (amount > balance) {
        alert('Insufficient funds');
        return;
    }
    
    balance -= amount;
    const serviceName = document.getElementById('service-select').options[document.getElementById('service-select').selectedIndex].text;
    transactions.push({
        date: new Date().toLocaleString(),
        type: `Service: ${serviceName}`,
        amount: -amount,
        balance: balance
    });
    document.getElementById('transaction-title').textContent = 'Payment Complete';
    document.getElementById('transaction-message').textContent = `You have paid $${amount.toFixed(2)} for ${serviceName}`;
    document.getElementById('new-balance').textContent = `$${balance.toFixed(2)}`;
    showScreen('transaction-screen');
    updateBalanceDisplay();
}

// Show transaction history
function showHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    if (transactions.length === 0) {
        historyList.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted py-3">
                    No transactions yet
                </td>
            </tr>
        `;
    } else {
        // Show transactions in reverse chronological order
        transactions.slice().reverse().forEach(transaction => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${transaction.date}</td>
                <td>${transaction.type}</td>
                <td class="${transaction.amount > 0 ? 'text-success' : 'text-danger'}">
                    ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td>$${transaction.balance.toFixed(2)}</td>
            `;
            historyList.appendChild(row);
        });
    }
    
    showScreen('history-screen');
}
