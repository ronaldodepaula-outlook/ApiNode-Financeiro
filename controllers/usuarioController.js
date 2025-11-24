const Usuario = require("../models/Usuario");
const base = require("./baseController");

// populate padrão: empresa, papel
module.exports = {
  create: base.create(Usuario),
  getAll: base.getAll(Usuario, "empresa_id papel_id"),
  getById: base.getById(Usuario, "empresa_id papel_id"),
  update: base.update(Usuario),
  remove: base.remove(Usuario),
};
