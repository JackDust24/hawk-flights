const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

const jwt_secret = constants.JWT_SECRET;

const db = new sqlite3.Database('./database.sqlite');

router.post('/register', async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const insertSQL = `
  INSERT INTO users (username, email, hashedPassword, role)
  VALUES (?, ?, ?, ?)
`;

    db.run(insertSQL, [username, email, hashedPassword, role], function (err) {
      if (err) {
        console.error('Error inserting user:', err.message);
      } else {
        console.log(`User ${username} inserted with ID: ${this.lastID}`);
      }
    });
  } catch (err) {
    console.error('Error hashing password:', err.message);
    res.status(400).json({
      message: 'Invalid Register',
      error: 'Please provide all required fields',
    });
  }

  res.json({ message: 'User registered' });
});

router.post('/login', async (req, res) => {
  const { username, email, password } = req.body;

  console.log('Login attempt:', username, email, password);

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      console.log('compare:', password, user.hashedPassword);

      const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

      console.log('passwordMatch:', passwordMatch);

      if (passwordMatch) {
        const token = jwt.sign({ id: user.id, role: user.role }, jwt_secret, {
          expiresIn: '1h',
        });

        res.cookie('token', token, {
          httpOnly: true,
          secure: false, // Will be true in production
          sameSite: 'Strict',
          maxAge: 3600000,
        });

        return res.json({ message: 'Login successful' });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }
  );
});

module.exports = router;
