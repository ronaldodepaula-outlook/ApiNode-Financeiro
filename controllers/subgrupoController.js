const Subgrupo = require("../models/Subgrupo");
const base = require("./baseController");

module.exports = {
  create: base.create(Subgrupo),
  getAll: base.getAll(Subgrupo),
  getById: base.getById(Subgrupo),
  update: base.update(Subgrupo),
  remove: base.remove(Subgrupo),
};
