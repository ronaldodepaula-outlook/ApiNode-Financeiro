const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Token = require('../models/Token');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

module.exports = async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization || req.headers.Authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token not provided' });
    }

    const token = auth.split(' ')[1];

    // Check blacklist
    const black = await Token.findOne({ token });
    if (black) return res.status(401).json({ error: 'Token invalidated' });

    const payload = jwt.verify(token, JWT_SECRET);
    if (!payload || !payload.id) return res.status(401).json({ error: 'Invalid token' });

    const user = await Usuario.findById(payload.id).populate('empresa_id papel_id');
    if (!user) return res.status(401).json({ error: 'User not found' });

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token', detail: err.message });
  }
};
