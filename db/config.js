const sql = require("mssql");

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  port: parseInt(process.env.DB_PORT || "1433", 10),
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: process.env.DB_INSTANCE || "SQLEXPRESS",
  },
};

let poolPromise;

function getConnection() {
  if (!poolPromise) {
    poolPromise = new sql.ConnectionPool(dbSettings)
      .connect()
      .then((pool) => {
        console.log("✅ DB connected");
        return pool;
      })
      .catch((err) => {
        poolPromise = null; // reset pool si falla
        console.error("❌ DB connection failed:", err.message);
        throw err;
      });
  }
  return poolPromise;
}

module.exports = { sql, getConnection };
