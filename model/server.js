const express = require("express");
const app = express();
const corsMiddleware = require("../middleware/cors"); // 🔄 Cambié el nombre para evitar conflictos

const solicitudRoutes = require("../routes/solicitud.routes");
const solicitanteRoutes = require("../routes/solicitante.routes");
const encargadoRoutes = require("../routes/encargado.routes");

app.use(express.json());
app.use(corsMiddleware); // 🔄 Usamos el nuevo nombre para la variable

app.use("/api", solicitudRoutes);
app.use("/api", encargadoRoutes);
app.use("/api", solicitanteRoutes);

app.get("/", (req, res) => {
  res.send("API funcionando 🚀");
});

module.exports = app;
