const jwt = require('jsonwebtoken');
const constants = require('../utils/constants');

const jwt_secret = constants.JWT_SECRET;

function auth(req, res, next) {
  const authHeader = req.headers['authorization'];
  const authToken = authHeader && authHeader?.split(' ')[1];

  const token = req.cookies.token ?? authToken;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, jwt_secret, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    req.user = user;
    next();
  });
}

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).send('Access denied');
    }
    next();
  };
};

module.exports = { auth, authorizeRole };
