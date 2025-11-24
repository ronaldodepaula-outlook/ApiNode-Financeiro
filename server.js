const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const empresaRoutes = require("./routes/empresaRoutes");
const usuarioRoutes = require("./routes/usuarioRoutes");
const masterAdminRoutes = require("./routes/masterAdminRoutes");
const papelRoutes = require("./routes/papelRoutes");
const licencaRoutes = require("./routes/licencaRoutes");
const grupoRoutes = require("./routes/grupoRoutes");
const subgrupoRoutes = require("./routes/subgrupoRoutes");
const movimentacaoRoutes = require("./routes/movimentacaoRoutes");
const historicoRoutes = require("./routes/historicoRoutes");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/empresas", empresaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/master-admin", masterAdminRoutes);
app.use("/api/papeis", papelRoutes);
app.use("/api/licencas", licencaRoutes);
app.use("/api/grupos", grupoRoutes);
app.use("/api/subgrupos", subgrupoRoutes);
app.use("/api/movimentacoes", movimentacaoRoutes);
app.use("/api/historico", historicoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
