const mongoose = require("mongoose");

const PapelSchema = new mongoose.Schema(
  {
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
