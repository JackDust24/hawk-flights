const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();
const { z } = require('zod');

const db = new sqlite3.Database('./database.sqlite');

const bookingSchema = z.object({
  fullname: z.string().min(1, 'Full name is required'),
  totalPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Total price must be a valid amount'),
  flightData: z
    .array(
      z.object({
        id: z.number().int().positive(), // id must be a positive integer
        origin: z.string().min(1, 'Origin is required'), // origin must be a non-empty string
        destination: z.string().min(1, 'Destination is required'), // destination must be a non-empty string
        flight_date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'), // date must follow YYYY-MM-DD format
        flight_time: z
          .string()
          .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format (HH:MM)'), // time must follow HH:MM format
        stops: z.number().int().nonnegative(), // stops must be a non-negative integer
        flight_length: z.number().positive(), // flight_length must be a positive number (hours)
        price: z.number().positive(), // price must be a positive number
        flight_number: z.string().min(1, 'Flight number is required'),
      })
    )
    .min(1, 'At least one flight is required'),
  paid: z.boolean(),
  email: z.string().email('Invalid email address'),
});

const generateBookingId = () => {
  return `hawk_flight-${Date.now()}`;
};

router.post('/', (req, res) => {
  const validationResult = bookingSchema.safeParse(req.body);

  const { fullname, totalPrice, flightData, paid, email } = req.body;

  if (!validationResult.success) {
    return res.status(400).json({ error: validationResult.error.errors });
  }

  const bookingId = generateBookingId();

  const flightDetailsString = JSON.stringify(flightData);

  const input = db.prepare(`
    INSERT INTO bookings (bookingId, fullname, totalPrice, flightDetails, paid, email)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  input.run(
    bookingId,
    fullname,
    totalPrice,
    flightDetailsString,
    paid ? 1 : 0,
    email,
    function (err) {
      if (err) {
        console.error('Error running the query:', err.message);
      } else {
        console.log('Booking successfully inserted, ID:', this.lastID);
      }
    }
  );

  res.json({
    bookingId,
    flightDetails: flightData,
    totalPrice,
    fullname: fullname,
    email,
    paid,
  });

  input.finalize();
});

module.exports = router;
