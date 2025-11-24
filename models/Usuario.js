const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema(
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
    email: {
      type: String,
      required: true,
      unique: true
    },
    senha: {
      type: String,
      required: true
    },
    papel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Papel",
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Usuario", UsuarioSchema);
