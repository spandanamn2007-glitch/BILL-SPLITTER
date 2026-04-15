# 💰 Bill Splitter Application

A beautiful web application to split expenses among friends with MongoDB backend.

## 🌐 Live Demo
Deploy this to Vercel for your presentation! See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions.

## Features

✅ Add expenses with description, amount, and participants
✅ Track who paid and who owes whom
✅ Automatic settlement calculations
✅ Beautiful, modern UI with animations
✅ MongoDB database storage
✅ Real-time updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Compass or MongoDB Server running locally

## Installation

1. Install dependencies:
```bash
npm install
```

2. Make sure MongoDB is running on your system:
   - If using MongoDB Compass, start the connection to `mongodb://localhost:27017`
   - The database `billsplitter` will be created automatically

3. Start the server (browser opens automatically):

**Option 1 - Double-click the file:**
```
start.bat
```

**Option 2 - Run command in terminal:**
```bash
npm start
```

**⚠️ Important:** If you get "EADDRINUSE" error, the server is already running! Just open your browser to http://localhost:3000

To stop the server: Press `Ctrl + C` in the terminal

## Usage

1. Open your browser and go to: **http://localhost:3000**

2. Add an expense:
   - Enter expense description (e.g., "Dinner at restaurant")
   - Enter the amount paid
   - Enter who paid
   - Enter participants (comma-separated names)
   - Click "Add Expense"

3. View settlements to see who owes whom

4. Check MongoDB Compass to see stored data in the `billsplitter` database

## MongoDB Structure

**Database:** billsplitter
**Collection:** expenses

Each expense document contains:
- description: String
- amount: Number
- paidBy: String
- participants: Array of Strings
- splitDetails: Array of {person, amount}
- createdAt: Date

## API Endpoints

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `GET /api/settlements` - Calculate who owes whom
- `DELETE /api/expenses/:id` - Delete an expense

## Technologies Used

- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Styling:** Modern CSS with gradients and animations
