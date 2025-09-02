const { sql, getConnection } = require("../db/config");

// Obtener todos los encargados
const getEncargados = async (req, res) => {
    try {
        const pool = await getConnection();
        // Se corrige la consulta para incluir el esquema 'dbo'
        const result = await pool.request().query("SELECT * FROM dbo.Encargado");
        res.json(result.recordset);
    } catch (err) {
        console.error("Error en el controlador de encargados:", err);
        res.status(500).json({ error: "Error al obtener los encargados" });
    } finally {
        sql.close();
    }
};

// Crear nuevo encargado
const createEncargado = async (req, res) => {
    try {
        const { nombre, cargo } = req.body;
        const pool = await getConnection();
        await pool.request()
            .input("nombre", sql.VarChar, nombre)
            .input("cargo", sql.VarChar, cargo)
            // Se corrige la consulta para incluir el esquema 'dbo'
            .query("INSERT INTO dbo.Encargado (nombre, cargo) VALUES (@nombre, @cargo)");

        res.status(201).json({ message: "Encargado creado correctamente" });
    } catch (err) {
        console.error("Error en el controlador de encargados:", err);
        res.status(500).json({ error: "Error al crear el encargado" });
    } finally {
        sql.close();
    }
};

module.exports = {
    getEncargados,
    createEncargado,
};
