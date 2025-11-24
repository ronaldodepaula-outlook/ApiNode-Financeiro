const mongoose = require("mongoose");

const EmpresaSchema = new mongoose.Schema(
  {
    cpf_cnpj: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    nome: {
      type: String,
      required: true
    },
    tipo: {
      type: String,
      enum: ["CPF", "CNPJ"],
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Empresa", EmpresaSchema);
