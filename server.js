const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/billsplitter';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Expense Schema
const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  paidBy: { type: String, required: true },
  participants: [{ type: String, required: true }],
  splitDetails: [{
    person: String,
    amount: Number
  }],
  createdAt: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount, paidBy, participants } = req.body;
    
    // Calculate split
    const splitAmount = amount / participants.length;
    const splitDetails = participants.map(person => ({
      person,
      amount: splitAmount
    }));

    const expense = new Expense({
      description,
      amount,
      paidBy,
      participants,
      splitDetails
    });

    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Calculate settlements
app.get('/api/settlements', async (req, res) => {
  try {
    const expenses = await Expense.find();
    const balances = {};

    // Calculate net balance for each person
    expenses.forEach(expense => {
      // Person who paid gets positive balance
      if (!balances[expense.paidBy]) balances[expense.paidBy] = 0;
      balances[expense.paidBy] += expense.amount;

      // Each participant owes their share
      expense.splitDetails.forEach(split => {
        if (!balances[split.person]) balances[split.person] = 0;
        balances[split.person] -= split.amount;
      });
    });

    // Calculate settlements
    const settlements = [];
    const creditors = [];
    const debtors = [];

    Object.entries(balances).forEach(([person, balance]) => {
      if (balance > 0.01) {
        creditors.push({ person, amount: balance });
      } else if (balance < -0.01) {
        debtors.push({ person, amount: Math.abs(balance) });
      }
    });

    // Match debtors with creditors
    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.amount, creditor.amount);

      settlements.push({
        from: debtor.person,
        to: creditor.person,
        amount: parseFloat(amount.toFixed(2))
      });

      debtor.amount -= amount;
      creditor.amount -= amount;

      if (debtor.amount < 0.01) i++;
      if (creditor.amount < 0.01) j++;
    }

    res.json(settlements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete expense
app.delete('/api/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📊 MongoDB: ${MONGODB_URI}`);
  console.log(`🌐 Opening browser...`);
  
  // Automatically open browser
  const url = `http://localhost:${PORT}`;
  const command = process.platform === 'win32' ? `start ${url}` : 
                  process.platform === 'darwin' ? `open ${url}` : 
                  `xdg-open ${url}`;
  
  exec(command, (error) => {
    if (error) {
      console.log(`⚠️  Please manually open: ${url}`);
    } else {
      console.log(`✅ Browser opened automatically!`);
    }
  });
});
