const jwt = require('jsonwebtoken');

const extractIdFromToken = (token) => {
  let userId = '';
  jwt.verify(token, 'secret_key', (err, decoded) => {
    if (err) userId = undefined;
    userId = decoded.userId;
  });
  return userId;
};

module.exports = {
  extractIdFromToken,
};
