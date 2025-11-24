const mongoose = require("mongoose");

const LicencaSchema = new mongoose.Schema({
  _id: String,
  empresa_id: { type: String, ref: "tb_empresas", required: true },
  plano: String,
  data_inicio: Date,
  data_fim: Date,
  status: { type: String, enum: ["ATIVA", "INATIVA", "EXPIRADA"] },
  limite_usuarios: Number,
  limite_movimentacoes: Number
});

LicencaSchema.index({ empresa_id: 1, status: 1 });

module.exports = mongoose.model("tb_licencas", LicencaSchema);
