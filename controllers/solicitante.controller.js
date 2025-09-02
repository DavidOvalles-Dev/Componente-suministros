const { sql, getConnection } = require("../db/config");

// Obtener todos los solicitantes
const getSolicitantes = async (req, res) => {
  try {
    const pool = await getConnection();
    // Se corrige la consulta para incluir el esquema 'dbo'
    const result = await pool.request().query("SELECT * FROM dbo.Solicitantes");
    res.json(result.recordset);
  } catch (err) {
    console.error("Error en el controlador de solicitantes:", err);
    res.status(500).json({ error: "Error al obtener los solicitantes" });
  } finally {
    sql.close();
  }
};

// Crear nuevo solicitante
const createSolicitante = async (req, res) => {
  try {
    const { nombre } = req.body;
    const pool = await getConnection();
    await pool.request()
      .input("nombre", sql.VarChar, nombre)
      // Se corrige la consulta para incluir el esquema 'dbo'
      .query("INSERT INTO dbo.Solicitantes (nombre) VALUES (@nombre)");

    res.status(201).json({ message: "Solicitante creado correctamente" });
  } catch (err) {
    console.error("Error en el controlador de solicitantes:", err);
    res.status(500).json({ error: "Error al crear el solicitante" });
  } finally {
    sql.close();
  }
};

module.exports = {
  getSolicitantes,
  createSolicitante,
};
