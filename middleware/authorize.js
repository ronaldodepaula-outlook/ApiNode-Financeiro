// authorize.js - middleware factory to check if the authenticated user's papel has a required permission
module.exports = function authorize(required) {
  // required can be a string or array of strings
  const requiredList = Array.isArray(required) ? required : [required];

  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ error: 'Not authenticated' });

      const papel = user.papel_id;
      if (!papel || !papel.permissoes) return res.status(403).json({ error: 'No permissions defined' });

      const has = requiredList.some(r => papel.permissoes.includes(r));
      if (!has) return res.status(403).json({ error: 'Forbidden: missing permission' });

      next();
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  };
};
