const mongoose = require("mongoose");

const MovimentacaoSchema = new mongoose.Schema(
  {
    empresa_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
      index: true
    },
    tipo: {
      type: String,
      enum: ["Receita", "Despesa"],
      required: true
    },
    valor: {
      type: Number,
      required: true
    },
    descricao: {
      type: String
    },
    grupo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grupo"
    },
    subgrupo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subgrupo"
    },
    usuario_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movimentacao", MovimentacaoSchema);
