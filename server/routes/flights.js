const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const validator = require('validator');

const db = new sqlite3.Database('./database.sqlite');

// For calling the database to get the mock data
const MOCK_ORIGIN = 'London';
const MOCK_DESTINATION = 'Bangkok';
const MOCK_FLIGHT_DATE = '2024-07-11';
const MOCK_RETURN_DATE = '2024-07-24';

router.get('/flights', (req, res) => {
  const { origin, destination, flightDate, returnDate } = req.query;

  if (
    !validator.isAlpha(origin, 'en-US', { ignore: ' ' }) ||
    !validator.isAlpha(destination, 'en-US', { ignore: ' ' }) ||
    !validator.isDate(flightDate) ||
    !validator.isDate(returnDate)
  ) {
    return res.status(400).json({
      message: 'Invalid input',
      error: 'Please provide valid fields',
    });
  }

  if (origin === destination) {
    return res.status(400).json({
      message: 'Invalid input',
      error: 'You cannot fly to the same place',
    });
  }

  db.all(`SELECT * FROM flights`, [], (err, rows) => {
    if (err) {
      logger.warn(
        `Possible databasee error retrieving from Flights table: ${err.message}`
      );
      console.error('Database error:', err.message);
      return res
        .status(500)
        .json({ message: 'Database error', error: err.message });
    }
  });

  if (origin && destination && flightDate && returnDate) {
    // Note for Mock reasons only to match the mock data in the database
    // Get the outboundFlights
    db.all(
      `SELECT * FROM flights
      WHERE origin = ? 
        AND destination = ? 
        AND flight_date = ?`,
      [MOCK_ORIGIN, MOCK_DESTINATION, MOCK_FLIGHT_DATE],
      (err, outboundFlights) => {
        if (err) {
          res
            .status(500)
            .json({ message: 'Database error', error: err.message });
          return;
        }

        // Get the return flights, by swapping the origin and destination and return date for flight date

        db.all(
          `SELECT * FROM flights
      WHERE origin = ? 
        AND destination = ? 
        AND flight_date = ?`,
          [MOCK_DESTINATION, MOCK_ORIGIN, MOCK_RETURN_DATE],
          (err, inBoundFlights) => {
            if (err) {
              res
                .status(500)
                .json({ message: 'Database error', error: err.message });
              return;
            }
            const modifiedOutboundFlights = outboundFlights.map((row) => ({
              ...row,
              origin: origin,
              destination: destination,
              flight_date: flightDate,
            }));

            const modifiedInboundFlights = inBoundFlights.map((row) => ({
              ...row,
              origin: destination,
              destination: origin,
              flight_date: returnDate,
            }));

            // Delay for demo purposes
            setTimeout(() => {
              res.status(200).json({
                message: 'Success',
                outbound: modifiedOutboundFlights,
                inbound: modifiedInboundFlights,
              });
            }, 1000);
          }
        );
      }
    );
  } else {
    res.status(400).json({
      message: 'Invalid input',
      error: 'Please provide all required fields',
    });
  }
});

module.exports = router;
