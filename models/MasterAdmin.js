const mongoose = require("mongoose");

const MasterAdminSchema = new mongoose.Schema(
  {
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
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("MasterAdmin", MasterAdminSchema);
