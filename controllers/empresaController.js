const Empresa = require("../models/Empresa");
const base = require("./baseController");

module.exports = {
  create: base.create(Empresa),
  getAll: base.getAll(Empresa),
  getById: base.getById(Empresa),
  update: base.update(Empresa),
  remove: base.remove(Empresa),
};
