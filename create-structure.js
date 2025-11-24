const connectDB = require("./config/db");

// importa todos os models (isso cria as coleções)
require("./models/Empresa");
require("./models/Usuario");
require("./models/Papel");
require("./models/Licenca");
require("./models/Grupo");
require("./models/Subgrupo");
require("./models/Movimentacao");
require("./models/HistoricoMovimentacao");
require("./models/MasterAdmin");

(async () => {
  await connectDB();
  console.log("✅ Estrutura criada com sucesso!");
  process.exit();
})();
