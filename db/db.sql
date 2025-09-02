CREATE DATABASE gestion_suministros;
GO

USE gestion_suministros;
GO

-- Tabla de Solicitudes de Suministro
CREATE TABLE SuministroSolicitud (
    id INT PRIMARY KEY IDENTITY(1,1),
    articulo VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL,
    solicitante_id INT NOT NULL,  -- 🔄 Se cambia a INT para relacionarlo con la tabla Solicitantes
    encargado_id INT NOT NULL,     -- 🔄 Se cambia a INT para relacionarlo con la tabla Encargado
    origen VARCHAR(150) NOT NULL,   -- 🔄 Se cambia el nombre de la columna
    fechaRetiro DATE NOT NULL,
    fechaEntrega DATE NOT NULL,
    estado VARCHAR(20) DEFAULT 'pendiente'
);


-- Tabla de Solicitantes
CREATE TABLE Solicitantes (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Consulta con INNER JOIN para SuministroSolicitud y Solicitantes
-- Muestra el nombre completo del solicitante en lugar del ID
SELECT
    ss.id,
    ss.articulo,
    ss.cantidad,
    ss.fechaRetiro,
    ss.fechaEntrega,
    s.nombre AS nombre_solicitante
FROM
    SuministroSolicitud AS ss
INNER JOIN
    Solicitantes AS s ON ss.solicitante_id = s.id;


-- Tabla de Encargado (corregida para MSSQL)
CREATE TABLE Encargado (
    id INT PRIMARY KEY IDENTITY(1,1), -- 🔄 Sintaxis de MSSQL
    nombre VARCHAR(255) NOT NULL,
    cargo VARCHAR(255)
);

-- Consulta con INNER JOIN para SuministroSolicitud y Encargado
-- Muestra el nombre completo del encargado en lugar del ID
SELECT
    ss.id,
    ss.articulo,
    ss.cantidad,
    ss.fechaRetiro,
    ss.fechaEntrega,
    e.nombre AS nombre_encargado
FROM
    SuministroSolicitud AS ss
INNER JOIN
    Encargado AS e ON ss.encargado_id = e.id;


-- Inserciones de datos de prueba (ajustadas a los nuevos nombres y relaciones)

-- Datos de prueba para Solicitantes (para que coincidan con los ID)
-- 1. Juan Pérez
-- 2. Ana Gómez
-- 3. Pedro Rodríguez
INSERT INTO Solicitantes (nombre) VALUES
('Juan Pérez'),
('Ana Gómez'),
('Pedro Rodríguez');


-- Datos de prueba para Encargado
-- 1. Juan Pérez
-- 2. María Gómez
-- 3. Luis Rodríguez
INSERT INTO Encargado (nombre, cargo) VALUES
('Juan Pérez', 'Gerente de Suministros'),
('María Gómez', 'Coordinadora de Inventario'),
('Luis Rodríguez', 'Asistente de Bodega');


-- Datos de prueba para SuministroSolicitud (usando los IDs de las tablas Solicitantes y Encargado)
INSERT INTO SuministroSolicitud (articulo, cantidad, solicitante_id, encargado_id, origen, fechaRetiro, fechaEntrega, estado)
VALUES 
('Botellón de agua', 4, 1, 1, 'Sede principal', '2025-08-28', '2025-08-30', 'pendiente'),
('Café', 2, 2, 2, 'Almacen', '2025-08-29', '2025-09-01', 'pendiente');
