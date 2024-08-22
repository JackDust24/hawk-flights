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
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, user) => {
        if (err) {
          console.error('Database error:', err.message);
          return res
            .status(500)
            .json({ message: 'Database error', error: err.message });
        }

        if (user) {
          return res.status(409).json({
            message: 'Username or email already taken',
            error: 'Please choose a different username or email',
          });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user
        const insertSQL = `
    INSERT INTO users (username, email, hashedPassword, role)
    VALUES (?, ?, ?, ?)
  `;

        db.run(
          insertSQL,
          [username, email, hashedPassword, role],
          function (err) {
            if (err) {
              console.error('Error inserting user:', err.message);
              return res
                .status(500)
                .json({ message: 'Error inserting user', error: err.message });
            } else {
              console.log(`User ${username} inserted with ID: ${this.lastID}`);
              return res.status(201).json({
                status: 201,
                success: true,
                message: 'User registered',
              });
            }
          }
        );
      }
    );
  } catch (err) {
    console.error('Error hashing password:', err.message);
    res.status(400).json({
      message: 'Invalid Register',
      error: 'Please provide all required fields',
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  console.log('email:', email);
  console.log('password:', password);

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ message: 'Database error', error: err.message });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);

    if (passwordMatch) {
      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
          username: user.username,
          email: user.email,
        },
        jwt_secret
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: false, // Will be true in production
        sameSite: 'Lax', // Adjust as needed
        maxAge: 3600000000,
      });

      return res.status(201).json({
        status: 200,
        success: true,
        message: 'Login successful',
        token,
        user,
      });
    } else {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});

module.exports = router;
