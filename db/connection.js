const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "means2Stuke!",
  database: "employees",
});

module.exports = db;
