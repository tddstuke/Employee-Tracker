const db = require("../db/connection");
const cTable = require("console.table");

// function to get all employees
const getEmployee = () => {
  db.query(`SELECT * FROM employee`, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    const table = cTable.getTable("Employees", rows);
    console.log(table);
  });
};

module.exports = getEmployee;
