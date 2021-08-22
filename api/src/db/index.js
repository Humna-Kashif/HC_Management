const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "hamzaPG",
  host: "localhost",
  port: 5432,
  database: "aibers_health",
});

module.exports = pool;