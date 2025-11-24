const mongoose = require("mongoose");

const SubgrupoSchema = new mongoose.Schema(
  {
    empresa_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empresa",
      required: true,
      index: true
    },
    grupo_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grupo",
      required: true
    },
    nome: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subgrupo", SubgrupoSchema);
