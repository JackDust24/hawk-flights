const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { consent } = req.body;

  console.log('User consent:', consent);
  //NOTE - Would set up this in an analytics table for whether user has given consent or not

  res.status(200).json({ message: 'Consent recorded' });
});

module.exports = router;
