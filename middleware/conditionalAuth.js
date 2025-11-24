// conditionalAuth.js - apply authMiddleware only for paths not in the PUBLIC_PATHS list
const authMiddleware = require('./authMiddleware');

const DEFAULT_PUBLIC = ['/api/auth'];

module.exports = function conditionalAuth(req, res, next) {
  const publicPaths = (process.env.PUBLIC_PATHS && process.env.PUBLIC_PATHS.split(',')) || DEFAULT_PUBLIC;
  const path = req.path || req.originalUrl || '';

  // if request path starts with any public prefix, skip auth
  for (const p of publicPaths) {
    if (!p) continue;
    if (path.startsWith(p)) return next();
  }

  // otherwise call auth middleware
  return authMiddleware(req, res, next);
};
