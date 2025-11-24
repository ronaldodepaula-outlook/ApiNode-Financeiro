const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(
      "mongodb+srv://root_db:TiMsl0912@db-finance-saas.hbwb9ie.mongodb.net/db-finance-saas"
    );

    console.log("✅ Conectado ao MongoDB Atlas!");
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
