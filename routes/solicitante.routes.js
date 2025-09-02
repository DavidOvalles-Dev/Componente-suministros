const express = require("express");
const router = express.Router();

const controller = require("../controllers/solicitante.controller");


// Rutas para los solicitantes que ahora usan el objeto 'controller'
router.get("/solicitantes", controller.getSolicitantes);
router.post("/solicitantes", controller.createSolicitante);

module.exports = router;
