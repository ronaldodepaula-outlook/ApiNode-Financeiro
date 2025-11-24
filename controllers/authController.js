const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const Empresa = require('../models/Empresa');
const Papel = require('../models/Papel');
const Token = require('../models/Token');

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';

// Helper to strip senha from returned object
function sanitizeUser(user) {
  const obj = user.toObject ? user.toObject() : user;
  if (obj.senha) delete obj.senha;
  return obj;
}

exports.register = async (req, res) => {
  try {
    const body = req.body || {};

    // Accept body.empresa or top-level empresa fields
    const empresaData = body.empresa || {
      cpf_cnpj: body.cpf_cnpj,
      nome: body.empresa_nome || body.empresa_name || body.nome_empresa || body.empresaNome,
      tipo: body.tipo || body.empresa_tipo
    };

    const userData = body.user || {
      nome: body.nome,
      email: body.email,
      senha: body.senha
    };

    if (!empresaData || !empresaData.cpf_cnpj || !userData || !userData.email || !userData.senha) {
      return res.status(400).json({ error: 'Missing required fields (empresa.cpf_cnpj, user.email, user.senha)' });
    }

    // Find or create Empresa by cpf_cnpj
    let empresa = await Empresa.findOne({ cpf_cnpj: empresaData.cpf_cnpj });
    if (!empresa) {
      empresa = await Empresa.create({ cpf_cnpj: empresaData.cpf_cnpj, nome: empresaData.nome || empresaData.cpf_cnpj, tipo: empresaData.tipo || 'CNPJ' });
    }

    // Find or create Papel with nome 'Admin'
    let papel = await Papel.findOne({ nome: 'Admin' });
    if (!papel) {
      papel = await Papel.create({ nome: 'Admin', permissoes: ['ADMINISTRADOR'] });
    }

    // Create user
    const existing = await Usuario.findOne({ email: userData.email });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const hashed = bcrypt.hashSync(userData.senha, 10);
    const usuario = await Usuario.create({ nome: userData.nome || userData.email, email: userData.email, senha: hashed, empresa_id: empresa._id, papel_id: papel._id });

    const token = jwt.sign({ id: usuario._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    const populated = await Usuario.findById(usuario._id).populate('empresa_id papel_id');

    return res.status(201).json({ token, user: sanitizeUser(populated) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body || {};
    if (!email || !senha) return res.status(400).json({ error: 'Email and senha required' });

    const user = await Usuario.findOne({ email }).populate('empresa_id papel_id');
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const match = bcrypt.compareSync(senha, user.senha);
    if (!match) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    return res.json({ token, user: sanitizeUser(user) });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

exports.me = async (req, res) => {
  // protected route via middleware
  const user = req.user;
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  return res.json({ user: sanitizeUser(user) });
};

exports.logout = async (req, res) => {
  try {
    const token = req.token || (req.body && req.body.token);
    if (!token) return res.status(400).json({ error: 'Token required' });

    // Decode to get expiry
    const decoded = jwt.decode(token);
    let expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24); // default 24h
    if (decoded && decoded.exp) expiresAt = new Date(decoded.exp * 1000);

    await Token.create({ token, expiresAt });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
