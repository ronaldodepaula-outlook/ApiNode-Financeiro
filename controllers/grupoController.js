const Grupo = require("../models/Grupo");
const base = require("./baseController");

module.exports = {
  create: base.create(Grupo),
  getAll: base.getAll(Grupo),
  getById: base.getById(Grupo),
  update: base.update(Grupo),
  remove: base.remove(Grupo),
};
