const express = require("express");
const router = express.Router();

const {
  getSolicitudes,
  getSolicitudById,  
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
  updateEstadoSolicitud

} = require("../controllers/solicitud.controller");

// Rutas de solicitudes
router.get("/solicitudes", getSolicitudes);         // Obtener todas las solicitudes
router.get("/solicitudes/:id", getSolicitudById);  // Obtener solicitud por ID
router.post("/solicitudes", createSolicitud);      // Crear nueva solicitud
router.put("/solicitudes/:id", updateSolicitud);  // Actualizar solicitud existente
router.delete("/solicitudes/:id", deleteSolicitud); // Eliminar solicitud
router.patch("/solicitudes/estado/:id", updateEstadoSolicitud); // Actualizar solo el estado de la solicitud

module.exports = router;
