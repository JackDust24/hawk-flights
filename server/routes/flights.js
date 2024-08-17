const express = require('express');
const router = express.Router();

router.get('/flights', (req, res) => {
  const { origin, destination, startDate, endDate } = req.query;

  if (origin && destination && startDate && endDate) {
    res.status(200).json({
      message: 'Flight search successful',
      data: { origin, destination, startDate, endDate },
    });
  } else {
    res.status(400).json({
      message: 'Invalid input',
      error: 'Please provide all required fields',
    });
  }
});

module.exports = router;
