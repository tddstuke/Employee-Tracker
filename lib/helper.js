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

// function to add new employee
const addEmployee = () => {
  // get first and last name
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
    // save name data in array
    .then((nameData) => {
      //   const { first_name, last_name } = nameData;
      employeeData = [nameData];
      console.log(employeeData);
      // get role of new employee but must retrieve existing roles from db first
      const rolesql = `SELECT role.title, role.id FROM role`;

      db.query(rolesql, (err, rows) => {
        if (err) throw err;
        // map data into key: value pairs
        const roleArray = rows.map(({ title, id }) => ({
          name: title,
          value: id,
        }));
        // console.log(roleArray);
        inquirer
          .prompt([
            {
              name: "role_id",
              type: "list",
              choices: roleArray,
            },
          ])
          .then((roleData) => {
            console.log(roleData);
            //   push role to data array
            employeeData.push(roleData);
            console.log(employeeData);

            // get manager for new employee but must get list of employees to choose from 1st
            const managerSql = `SELECT employee.first_name, employee.last_name, employee.id FROM employee`;

            db.query(managerSql, (err, rows) => {
              if (err) throw err;
              const ManagerArray = rows.map(
                ({ first_name, last_name, id }) => ({
                  name: [first_name + " " + last_name],
                  value: id,
                })
              );
              //   console.log(ManagerArray);
              inquirer
                .prompt([
                  {
                    name: "manager_id",
                    type: "list",
                    choices: ManagerArray,
                  },
                ])
                .then((managerData) => {
                  employeeData.push(managerData);
                  console.log(employeeData);
                  const [
                    { first_name, last_name },
                    { role_id },
                    { manager_id },
                  ] = employeeData;
                  const newEmployee = new Employee(
                    first_name,
                    last_name,
                    role_id,
                    manager_id
                  );
                  console.log(newEmployee);
                });
            });
          });
      });
    });
};

module.exports = { getEmployee, addEmployee };
