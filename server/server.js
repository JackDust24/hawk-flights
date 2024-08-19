const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { clearData, createFlights, insertMockData } = require('./data/dbserver'); // Import the functions
const flightsRoute = require('./routes/flights');
const paymentRoutes = require('./routes/payments');
const bookingRoutes = require('./routes/bookings');

const app = express();
const PORT = 8080;

const db = new sqlite3.Database('./database.sqlite');

createFlights(db)
  .then(() => clearData(db))
  .then(() => insertMockData(db))
  .then(() => {
    app.use(cors());

    // Middleware setup
    app.use(bodyParser.json());
    app.use(cors());

    app.use('/api', flightsRoute);
    app.use('/api/payments', paymentRoutes);
    app.use('/api/bookings', bookingRoutes);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
