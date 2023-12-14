const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/money_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Create an expense schema
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now },
});

const Expense = mongoose.model('Expense', expenseSchema);

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Routes
app.get('/', async (req, res) => {
  const expenses = await Expense.find().sort({ date: 'desc' });
  res.render('index', { expenses });
});

app.post('/addExpense', async (req, res) => {
  const { description, amount } = req.body;

  // Create a new expense
  const newExpense = new Expense({
    description,
    amount,
  });

  // Save the expense to the database
  await newExpense.save();
  res.redirect('/');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
