const { sql, getConnection } = require("../db/config");

// Función helper para validar y formatear fechas
const parseFecha = (fecha) => {
  if (!fecha) return null;
  const d = new Date(fecha);
  return isNaN(d) ? null : d;
};

// Obtener todas las solicitudes y marcar expiradas
const getSolicitudes = async (req, res) => {
  try {
    const pool = await getConnection();

    // Solo marcar como "Expirada" las pendientes cuya fecha ya pasó
    await pool
      .request()
      .query(`
        UPDATE dbo.SuministroSolicitud
        SET estado = 'Expirada'
        WHERE estado = 'Pendiente' AND fechaEntrega < GETDATE()
      `);

    // Obtener todas las solicitudes
    const result = await pool.request().query("SELECT * FROM dbo.SuministroSolicitud");
    res.json(result.recordset);
  } catch (err) {
    console.error("❌ Error en getSolicitudes:", err);
    res.status(500).json({ error: "Error al obtener las solicitudes" });
  }
};

// Obtener solicitud por ID y actualizar si está expirada
const getSolicitudById = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    // Solo actualizar a expirada si la solicitud está pendiente
    await pool
      .request()
      .input("id", sql.Int, id)
      .query(`
        UPDATE dbo.SuministroSolicitud
        SET estado = 'Expirada'
        WHERE id = @id AND fechaEntrega < GETDATE() AND estado = 'Pendiente'
      `);

    // Obtener la solicitud
    const result = await pool
      .request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM dbo.SuministroSolicitud WHERE id = @id");

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error("❌ Error en getSolicitudById:", err);
    res.status(500).json({ error: "Error al obtener la solicitud" });
  }
};

// Crear nueva solicitud
const createSolicitud = async (req, res) => {
  try {
    const {
      articulo,
      cantidad,
      solicitante_id,
      encargado_id,
      origen,
      fechaRetiro,
      fechaEntrega,
      estado,
    } = req.body;

    const pool = await getConnection();

    await pool
      .request()
      .input("articulo", sql.VarChar, articulo)
      .input("cantidad", sql.Int, cantidad)
      .input("solicitante_id", sql.Int, solicitante_id)
      .input("encargado_id", sql.Int, encargado_id)
      .input("origen", sql.VarChar, origen)
      .input("fechaRetiro", sql.Date, parseFecha(fechaRetiro))
      .input("fechaEntrega", sql.Date, parseFecha(fechaEntrega))
      .input("estado", sql.VarChar, estado)
      .query(`
        INSERT INTO dbo.SuministroSolicitud 
          (articulo, cantidad, solicitante_id, encargado_id, origen, fechaRetiro, fechaEntrega, estado)
        VALUES 
          (@articulo, @cantidad, @solicitante_id, @encargado_id, @origen, @fechaRetiro, @fechaEntrega, @estado)
      `);

    res.status(201).json({ message: "Solicitud creada correctamente" });
  } catch (err) {
    console.error("❌ Error en createSolicitud:", err);
    res.status(500).json({ error: "Error al crear la solicitud" });
  }
};

// Actualizar solicitud
const updateSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      articulo,
      cantidad,
      solicitante_id,
      encargado_id,
      origen,
      fechaRetiro,
      fechaEntrega,
      estado,
    } = req.body;

    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .input("articulo", sql.VarChar, articulo)
      .input("cantidad", sql.Int, cantidad)
      .input("solicitante_id", sql.Int, solicitante_id)
      .input("encargado_id", sql.Int, encargado_id)
      .input("origen", sql.VarChar, origen)
      .input("fechaRetiro", sql.Date, parseFecha(fechaRetiro))
      .input("fechaEntrega", sql.Date, parseFecha(fechaEntrega))
      .input("estado", sql.VarChar, estado)
      .query(`
        UPDATE dbo.SuministroSolicitud
        SET articulo=@articulo, 
            cantidad=@cantidad, 
            solicitante_id=@solicitante_id, 
            encargado_id=@encargado_id,
            origen=@origen, 
            fechaRetiro=@fechaRetiro, 
            fechaEntrega=@fechaEntrega, 
            estado=@estado
        WHERE id=@id
      `);

    res.json({ message: "Solicitud actualizada correctamente" });
  } catch (err) {
    console.error("❌ Error en updateSolicitud:", err);
    res.status(500).json({ error: "Error al actualizar la solicitud" });
  }
};

// Actualizar solo el estado de la solicitud
const updateEstadoSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ error: "Se requiere el estado" });
    }

    const pool = await getConnection();
    await pool
      .request()
      .input("id", sql.Int, id)
      .input("estado", sql.VarChar, estado)
      .query(`
        UPDATE dbo.SuministroSolicitud
        SET estado = @estado
        WHERE id = @id
      `);

    res.json({ message: `Solicitud actualizada a estado "${estado}" correctamente` });
  } catch (err) {
    console.error("❌ Error en updateEstadoSolicitud:", err);
    res.status(500).json({ error: "Error al actualizar el estado de la solicitud" });
  }
};

// Eliminar solicitud
const deleteSolicitud = async (req, res) => {
  try {
    const { id } = req.params;
    const pool = await getConnection();

    await pool
      .request()
      .input("id", sql.Int, id)
      .query("DELETE FROM dbo.SuministroSolicitud WHERE id=@id");

    res.json({ message: "Solicitud eliminada correctamente" });
  } catch (err) {
    console.error("❌ Error en deleteSolicitud:", err);
    res.status(500).json({ error: "Error al eliminar la solicitud" });
  }
};

module.exports = {
  getSolicitudes,
  getSolicitudById,
  createSolicitud,
  updateSolicitud,
  deleteSolicitud,
  updateEstadoSolicitud,
};
