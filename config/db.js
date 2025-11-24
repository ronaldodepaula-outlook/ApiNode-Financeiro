const mongoose = require("mongoose");

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI || "mongodb+srv://root_db:TiMsl0912@db-finance-saas.hbwb9ie.mongodb.net/db-finance-saas";
    await mongoose.connect(uri);

    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err);
    process.exit(1);
  }
}

module.exports = connectDB;
