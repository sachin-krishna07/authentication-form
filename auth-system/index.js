const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const mongoURI = 'mongodb+srv://sachinnkr2020:Sachin123@authentication.mmwr8nw.mongodb.net/?retryWrites=true&w=majority&appName=authentication'; // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  dateOfBirth: Date,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', UserSchema);

// Registration Route
app.post('/register', async (req, res) => {
  const { name, dateOfBirth, email, password } = req.body;

  if (!name || !dateOfBirth || !email || !password) {
    return res.status(400).send('All fields are required');
  }

  try {
    const newUser = new User({ name, dateOfBirth, email, password });
    await newUser.save();
    res.status(200).send('User registered successfully');
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send('User already exists');
    }
    res.status(500).send('Error registering user');
  }
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send('Email and password are required');
  }

  try {
    const user = await User.findOne({ email, password });
    if (!user) {
      return res.status(400).send('Invalid email or password');
    }
    res.status(200).send({
      token: 'your-jwt-token', // In a real app, generate a JWT token here
      user: {
        name: user.name,
        dateOfBirth: user.dateOfBirth,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).send('Error logging in');
  }
});

// Fetch Users Route
app.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude passwords
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send('Error fetching users');
  }
});

// Add User Route
app.post('/users', async (req, res) => {
  const { name, dateOfBirth, email } = req.body;

  if (!name || !dateOfBirth || !email) {
    return res.status(400).send('All fields are required');
  }

  try {
    const newUser = new User({ name, dateOfBirth, email });
    await newUser.save();
    res.status(200).send('User added successfully');
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).send('User already exists');
    }
    res.status(500).send('Error adding user');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
