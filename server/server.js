const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const sqlite3 = require('sqlite3').verbose();
const {
  clearData,
  createTables,
  insertMockData,
  insertDefaultUsers,
} = require('./data/dbserver');
const flightsRoute = require('./routes/flights');
const paymentRoutes = require('./routes/payments');
const bookingRoutes = require('./routes/bookings');
const userRoute = require('./routes/user');
const cookieRoute = require('./routes/cookie-consent');
const { auth, authorizeRole } = require('./middleware/auth');

const app = express();
const PORT = 8080;

const db = new sqlite3.Database('./database.sqlite');

createTables(db)
  .then(() => clearData(db))
  .then(() => insertMockData(db))
  .then(() => insertDefaultUsers(db))
  .then(() => {
    app.use(
      cors({
        origin: 'http://localhost:3000',
        credentials: true,
      })
    );

    app.use(bodyParser.json());
    // Parse cookies - not used in project, but can be useful for storing user data
    app.use(cookieParser());

    app.use('/api', flightsRoute);
    app.use('/api/user', userRoute);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/bookings', bookingRoutes);
    app.use('/api/cookie-consent', cookieRoute);

    // Protecting a route that requires authentication
    app.get('/profile', auth, (req, res) => {
      res.json({ message: 'approved', user: req.user });
    });

    // Protecting an admin-only route
    app.get('/admin-dashboard', auth, authorizeRole(['admin']), (req, res) => {
      res.json({ message: 'approved access', user: req.user });
    });

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
