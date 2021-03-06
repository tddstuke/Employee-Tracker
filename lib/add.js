const db = require("../db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Employee");

const addEmployee = (getEmployee, initialQuery) => {
  // get first and last name
  inquirer
    .prompt([
      {
        name: "first_name",
        type: "input",
        message: "What is the employee's first name?",
        validate: (first_name) => {
          if (first_name) {
            return true;
          } else {
            console.log("Please enter a first name!");
          }
        },
      },
      {
        name: "last_name",
        type: "input",
        message: "What is the employee's last name?",
        validate: (last_name) => {
          if (last_name) {
            return true;
          } else {
            console.log("Please enter a last name!");
          }
        },
      },
    ])
    // save name data in array
    .then((nameData) => {
      employeeData = [nameData];

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
              message: "Choose Employee's Role",
              choices: roleArray,
            },
          ])
          .then((roleData) => {
            // console.log(roleData);
            //   push role to data array
            employeeData.push(roleData);
            // console.log(employeeData);

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
              ManagerArray.push({ name: "None", value: null });
              //   console.log(ManagerArray);
              inquirer
                .prompt([
                  {
                    name: "manager_id",
                    type: "list",
                    message: "Choose Employee's Manager",
                    choices: ManagerArray,
                  },
                ])
                .then((managerData) => {
                  employeeData.push(managerData);
                  //   console.log(employeeData);
                  // deconstruct employeeData and use to build new Employee using prebuilt class
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

                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                    VALUES(?,?,?,?)`;
                  const params = [first_name, last_name, role_id, manager_id];
                  db.query(sql, params, (err, result) => {
                    if (err) throw err;
                    console.log("New Employee Added!");
                    getEmployee(initialQuery);
                  });
                  // console.log(newEmployee)
                });
            });
          });
      });
    });
};

const addRole = (getAllRoles, initialQuery) => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the new role?",
        validate: (title) => {
          if (title) {
            return true;
          } else {
            console.log("Please enter a title for the new role!");
          }
        },
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
        validate: (salary) => {
          if (isNaN(salary)) {
            console.log("Please enter a salary!");
            return false;
          } else {
            return true;
          }
        },
      },
    ])
    .then((newRoleData) => {
      newRoleArray = [newRoleData];

      // get departments list from db for list
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
              message: "Please choose a department for the new role",
              choices: departmentArray,
            },
          ])
          .then((departmentData) => {
            newRoleArray.push(departmentData);
            // console.log(newRoleArray);
            // add db query to add role to db
            const [{ title, salary }, { department_id }] = newRoleArray;
            const sql = `INSERT INTO role (title, salary, department_id)
              VALUES (?,?,?)`;
            params = [title, salary, department_id];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("New role added!");
              getAllRoles(initialQuery);
            });
          });
      });
    });
};

const addDepartment = (getDepartment, initialQuery) => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the new Department?",
        validate: (name) => {
          if (name) {
            return true;
          } else {
            console.log("Please enter a name for the department!");
          }
        },
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO department (name)
      VALUE(?)`;

      params = [data.name];
      db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log("New department added!");
        getDepartment(initialQuery);
      });
    });
};

module.exports = { addDepartment, addEmployee, addRole };
