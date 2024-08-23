const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');
const cookie = require('cookie');
const logger = require('../utils/logger');

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
          logger.warn(
            `Possible database issue when registering user: ${err.message}`
          );

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
              logger.info(`Error inserting user: ${err.message}`);
              return res
                .status(500)
                .json({ message: 'Error inserting user', error: err.message });
            } else {
              logger.info(
                `User ${username} inserted user table with ID: ${this.lastID}`
              );
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
    logger.info(`Error hashing password: ${err.message}`);
    res.status(400).json({
      message: 'Invalid Register',
      error: 'Please provide all required fields',
    });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      logger.warn(
        `Possible database issue when user logging in: ${err.message}`
      );
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

      res.setHeader(
        'Set-Cookie',
        cookie.serialize('token', String(token), {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          maxAge: 360000000,
          sameSite: 'strict',
          path: '/',
        })
      );
      logger.info(`User logged in: ${user.username}`);
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

// Not implemented in frontend but here if user wishes to delete their account
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    res.status(200).json({ message: 'User data deleted successfully' });
  } catch (err) {
    logger.warn(`Unable to delete user: UserId: ${id}`);
    res
      .status(500)
      .json({ message: 'Error deleting user data', error: err.message });
  }
});

module.exports = router;
