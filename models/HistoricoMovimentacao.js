const mongoose = require("mongoose");

const HistoricoMovimentacaoSchema = new mongoose.Schema(
  {
    movimentacao_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Movimentacao",
      required: true,
      index: true
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    },
    acao: {
      type: String,
      enum: ["CRIAR", "EDITAR", "EXCLUIR"],
      required: true
    },
    detalhe: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("HistoricoMovimentacao", HistoricoMovimentacaoSchema);
