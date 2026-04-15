const API_URL = 'http://localhost:3000/api';

// Show notification
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Load expenses
async function loadExpenses() {
    try {
        const response = await fetch(`${API_URL}/expenses`);
        const expenses = await response.json();
        
        const expensesList = document.getElementById('expensesList');
        
        if (expenses.length === 0) {
            expensesList.innerHTML = '<p class="empty-state">No expenses added yet.</p>';
            return;
        }
        
        expensesList.innerHTML = expenses.map(expense => `
            <div class="expense-item">
                <div class="expense-info">
                    <h3>${expense.description}</h3>
                    <div class="expense-details">
                        <strong>Paid by:</strong> ${expense.paidBy} | 
                        <strong>Split among:</strong> ${expense.participants.join(', ')}
                    </div>
                    <div class="split-info">
                        ${expense.splitDetails.map(s => 
                            `${s.person}: $${s.amount.toFixed(2)}`
                        ).join(' • ')}
                    </div>
                </div>
                <div class="expense-actions">
                    <div class="expense-amount">$${expense.amount.toFixed(2)}</div>
                    <button class="btn btn-danger" onclick="deleteExpense('${expense._id}')">Delete</button>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        showNotification('Error loading expenses', 'error');
        console.error(error);
    }
}

// Load settlements
async function loadSettlements() {
    try {
        const response = await fetch(`${API_URL}/settlements`);
        const settlements = await response.json();
        
        const settlementsList = document.getElementById('settlements');
        
        if (settlements.length === 0) {
            settlementsList.innerHTML = '<p class="empty-state">All settled up! 🎉</p>';
            return;
        }
        
        settlementsList.innerHTML = settlements.map(settlement => `
            <div class="settlement-item">
                <strong>${settlement.from}</strong> owes <strong>${settlement.to}</strong>
                <div class="settlement-amount">$${settlement.amount.toFixed(2)}</div>
            </div>
        `).join('');
        
    } catch (error) {
        showNotification('Error loading settlements', 'error');
        console.error(error);
    }
}

// Add expense
document.getElementById('expenseForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const paidBy = document.getElementById('paidBy').value.trim();
    const participantsInput = document.getElementById('participants').value;
    const participants = participantsInput.split(',').map(p => p.trim()).filter(p => p);
    
    if (participants.length === 0) {
        showNotification('Please add at least one participant', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description, amount, paidBy, participants })
        });
        
        if (response.ok) {
            showNotification('Expense added successfully!');
            document.getElementById('expenseForm').reset();
            loadExpenses();
            loadSettlements();
        } else {
            throw new Error('Failed to add expense');
        }
    } catch (error) {
        showNotification('Error adding expense', 'error');
        console.error(error);
    }
});

// Delete expense
async function deleteExpense(id) {
    if (!confirm('Are you sure you want to delete this expense?')) return;
    
    try {
        const response = await fetch(`${API_URL}/expenses/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            showNotification('Expense deleted');
            loadExpenses();
            loadSettlements();
        } else {
            throw new Error('Failed to delete expense');
        }
    } catch (error) {
        showNotification('Error deleting expense', 'error');
        console.error(error);
    }
}

// Refresh settlements button
document.getElementById('refreshSettlements').addEventListener('click', () => {
    loadSettlements();
    showNotification('Settlements refreshed!');
});

// Initial load
loadExpenses();
loadSettlements();
