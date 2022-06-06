const db = require("../db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");

// function to get all employees
const getEmployee = (initialQuery) => {
  const sql = `SELECT employee.id, 
  employee.first_name,
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
    if (err) throw err;
    const table = cTable.getTable("Employees", rows);
    console.table(table);

    initialQuery();
  });
};

const getAllRoles = (initialQuery) => {
  const rolesql = `SELECT role.id, role.title FROM role`;

  db.query(rolesql, (err, rows) => {
    if (err) throw err;
    const table = cTable.getTable("Roles", rows);
    console.table(table);
    initialQuery();
  });
};

const getDepartment = (initialQuery) => {
  const sql = `SELECT department.id, department.name FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    const table = cTable.getTable("Departments", rows);
    console.table(table);
    initialQuery();
  });
};

module.exports = {
  getEmployee,
  getAllRoles,
  getDepartment,
};
