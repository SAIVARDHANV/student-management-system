require('dotenv').config();

const cors = require('cors');
const cookieParser = require('cookie-parser');
const express = require('express');

const app = express();
const revokedTokens = new Set();
const allowedOrigins = new Set([process.env.CLIENT_ORIGIN || 'http://localhost:5173']);

if (process.env.NODE_ENV !== 'production') {
  allowedOrigins.add('http://127.0.0.1:5173');
}

app.use(cors({
  origin(origin, callback) {
    callback(null, !origin || allowedOrigins.has(origin));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.post('/api/auth/logout', (req, res) => {
  const authorization = req.get('Authorization') || '';
  const [scheme, bearerToken] = authorization.split(' ');
  const token = scheme?.toLowerCase() === 'bearer' ? bearerToken : req.cookies.token;

  if (token) {
    revokedTokens.add(token);
  }

  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
  });

  return res.status(200).json({ message: 'Logout successful' });
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
