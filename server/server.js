const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const { clearData, createFlights, insertMockData } = require('./data/dbserver'); // Import the functions
const flightsRoute = require('./routes/flights');

const app = express();
const PORT = 8080;

const db = new sqlite3.Database('./database.sqlite');

createFlights(db)
  .then(() => clearData(db))
  .then(() => insertMockData(db))
  .then(() => {
    console.log('Database setup and mock data insertion completed.');

    app.use(cors());

    // Middleware setup
    app.use(bodyParser.json());
    app.use(cors());

    app.use('/api', flightsRoute);

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  });
