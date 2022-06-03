const db = require("../db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Employee");

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

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
      },
    ])
    .then((nameData) => {
      const params = [nameData.first_name, nameData.last_name];

      console.log(params);

      const rolesql = `SELECT role.title, role.id FROM role`;

      db.query(rolesql, (err, rows) => {
        if (err) throw err;
        const roleArray = rows.map(({ title, id }) => ({
          name: title,
          value: id,
        }));
        console.log(roleArray);
        inquirer
          .prompt([
            {
              name: "role_id",
              type: "list",
              choices: roleArray,
            },
          ])
          .then((roleData) => {
            params.push(roleData.role_id);
            console.log(params);
          });
      });
    });
};

module.exports = { getEmployee, addEmployee };
