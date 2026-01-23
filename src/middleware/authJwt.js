require('dotenv').config();

const config = require('../config/auth');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  let apiKey = req.headers[config.header.toLowerCase()];

  if (!apiKey) {
    return res.status(401).send({ message: "No API key provided!" });
  }

  if (apiKey !== process.env.JWT_SECRET_KEY) {
    return res.status(403).send({ message: "Invalid API key!" });
  }

  next();
};

const authJwt = {
  verifyToken: verifyToken,
};

module.exports = authJwt;