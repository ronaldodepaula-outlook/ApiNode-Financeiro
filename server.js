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
const authRoutes = require("./routes/authRoutes");
const conditionalAuth = require("./middleware/conditionalAuth");
const authorize = require("./middleware/authorize");

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Public auth routes (register/login)
app.use("/api/auth", authRoutes);

// Apply conditional auth: only paths not listed in PUBLIC_PATHS will require authentication
app.use(conditionalAuth);

// Example of applying authorization per-route: only admins can manage papeis
app.use("/api/papeis", authorize('ADMINISTRADOR'), papelRoutes);

// The remaining routes are protected by conditionalAuth but not additionally restricted here
app.use("/api/empresas", empresaRoutes);
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/master-admin", masterAdminRoutes);
app.use("/api/licencas", licencaRoutes);
app.use("/api/grupos", grupoRoutes);
app.use("/api/subgrupos", subgrupoRoutes);
app.use("/api/movimentacoes", movimentacaoRoutes);
app.use("/api/historico", historicoRoutes);

const PORT = process.env.PORT || 3000;
// Only start listening when run directly. This allows tests to `require('./server')` without starting the server.
if (require.main === module) {
	app.listen(PORT, () => console.log(`✅ API rodando na porta ${PORT}`));
}

module.exports = app;
