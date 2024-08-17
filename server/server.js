const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const flightsRoute = require('./routes/flights');

const app = express();
const PORT = 8080;

app.use(cors());

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

app.use('/api', flightsRoute);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
