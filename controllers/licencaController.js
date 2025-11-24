const Licenca = require("../models/Licenca");
const base = require("./baseController");

module.exports = {
  create: base.create(Licenca),
  getAll: base.getAll(Licenca),
  getById: base.getById(Licenca),
  update: base.update(Licenca),
  remove: base.remove(Licenca),
};
