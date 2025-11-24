const Historico = require("../models/HistoricoMovimentacao");
const base = require("./baseController");

module.exports = {
  create: base.create(Historico),
  getAll: base.getAll(Historico),
  getById: base.getById(Historico),
  update: base.update(Historico),
  remove: base.remove(Historico),
};
