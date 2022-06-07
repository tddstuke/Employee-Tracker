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

const getManagerEmployees = (initialQuery) => {
  // get list of employees to select from
  const sql = `SELECT employee.first_name, employee.last_name, employee.id FROM employee`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    const employeeArray = rows.map(({ first_name, last_name, id }) => ({
      name: [first_name + " " + last_name],
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Choose A Manager To View",
          choices: employeeArray,
        },
      ])
      .then((data) => {
        const sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee
       WHERE manager_id = ?`;
        params = [data.id];
        db.query(sql, params, (err, rows) => {
          if (err) throw err;
          if (!rows.id) {
            console.log("No employees under this choice");
          }
          const table = cTable.getTable("Employees", rows);
          console.table(table);
          initialQuery();
        });
      });
  });
};

const getByDepartment = (initialQuery) => {
  const sql = `SELECT department.id, department.name FROM department`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    departmentArray = rows.map(({ name, id }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "department_id",
          type: "list",
          message: "Choose A Department To View It's Employees",
          choices: departmentArray,
        },
      ])
      .then((data) => {
        // console.log(data);
        const { department_id } = data;

        const sql = `SELECT role.id, role.title FROM role WHERE department_id = ?`;
        const params = [department_id];
        // console.log(params);
        db.query(sql, params, (err, rows) => {
          // console.log(rows);
          if (err) throw err;
          employeeparams = rows.map(({ id }) => id);
          // console.log(employeeparams);

          const employeesql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee
          WHERE role_id = ?`;
          const rowData = [];
          employeeparams.forEach((params) => {
            db.query(employeesql, params, (err, rows) => {
              const [{ id, first_name, last_name }] = rows;
              const employeeData = { id, first_name, last_name };
              rowData.push(employeeData);
            });
          });
          setTimeout(() => {
            const table = cTable.getTable("Employees", rowData);
            console.table(table);
            initialQuery();
          }, 1000);
        });
      });
  });
};

module.exports = {
  getEmployee,
  getAllRoles,
  getDepartment,
  getManagerEmployees,
  getByDepartment,
};
