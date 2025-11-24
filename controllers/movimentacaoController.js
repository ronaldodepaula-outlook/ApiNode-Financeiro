const Movimentacao = require("../models/Movimentacao");
const base = require("./baseController");

// Ao criar movimentação, opcionalmente registrar histórico (simples)
const create = async (req, res) => {
  try {
    const mov = await Movimentacao.create(req.body);
    // opcional: criar histórico aqui (se tiver model HistoricoMovimentacao)
    return res.status(201).json(mov);
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

module.exports = {
  create,
  getAll: base.getAll(Movimentacao, "grupo_id subgrupo_id usuario_id"),
  getById: base.getById(Movimentacao, "grupo_id subgrupo_id usuario_id"),
  update: base.update(Movimentacao),
  remove: base.remove(Movimentacao),
};
