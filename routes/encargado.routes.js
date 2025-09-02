const express = require("express");
const router = express.Router();
const controller = require("../controllers/encargado.controller");

router.get("/encargados", controller.getEncargados);

module.exports = router;
