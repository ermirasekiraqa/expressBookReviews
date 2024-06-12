const jwt = require('jsonwebtoken');
const SECRET_KEY = 'access';

const authenticateJWT = (req, res, next) => {
  const bearerToken = req.header('Authorization');
  if (!bearerToken) {
    return res.status(401).json({ message: 'Access token is missing' });
  }

  const splitToken = bearerToken.split(" ");
  const token = splitToken[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.username = decoded.username;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid access token' });
  }
};

module.exports = authenticateJWT;
