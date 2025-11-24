const mongoose = require("mongoose");

const PapelSchema = new mongoose.Schema(
  {
    empresa_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
      index: true
    },
    nome: {
      type: String,
      required: true
    },
    permissoes: {
      type: Array,
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Papel", PapelSchema);
