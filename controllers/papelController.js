const Papel = require("../models/Papel");
const base = require("./baseController");

module.exports = {
  create: base.create(Papel),
  getAll: base.getAll(Papel),
  getById: base.getById(Papel),
  update: base.update(Papel),
  remove: base.remove(Papel),
};
