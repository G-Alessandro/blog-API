const jwt = require('jsonwebtoken');

const opts = { expiresIn: '1d' };
const secret = process.env.JWT_SECRET_KEY;
const generateToken = (user) => jwt.sign({ id: user._id, username: user.username }, secret, opts);

const verifyToken = (token) => jwt.verify(token, secret);

module.exports = { generateToken, verifyToken };
