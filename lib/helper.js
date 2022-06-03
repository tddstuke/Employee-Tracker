const db = require("../db/connection");
const cTable = require("console.table");

// function to get all employees
const getEmployee = () => {
  const sql = `SELECT employee.id, 
  employee.last_name, 
  role.title, 
  department.name AS department, 
  role.salary, 
  CONCAT (manager.first_name, " ", manager.last_name) AS manager
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
  db.query(sql, (err, rows) => {
    if (err) {
      console.log({ error: err.message });
      return;
    }
    const table = cTable.getTable("Employees", rows);
    console.table(table);
  });
};

const addEmployee = () => {};

module.exports = { getEmployee, addEmployee };
