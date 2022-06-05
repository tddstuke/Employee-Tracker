const db = require("../db/connection");
const inquirer = require("inquirer");
const cTable = require("console.table");
const Employee = require("./Employee");
// const readFilePromise = util.promisify(fs.readFile)
// const { initialQuery } = require("../index.js");
// console.log(initialQuery);
// function to get all employees
const readFilePromise = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, options, (err, data) => {
      if (err) return reject(err);
      resolve(data);
    });
  });
};
const getEmployee = (initialQuery) => {
  return new Promise((resolve, reject) => {
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
      if (err) reject(err);
      const table = cTable.getTable("Employees", rows);
      console.table(table);
      resolve(rows);
      // initialQuery();
    });
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
                    getEmployee();
                  });
                  // console.log(newEmployee)
                });
            });
          });
      });
    });
};

const updateEmployee = () => {
  // get list of employees to select from
  const sql = `SELECT employee.first_name, employee.last_name, employee.id FROM employee`;
  db.query(sql, (err, rows) => {
    if (err) throw err;
    const employeeArray = rows.map(({ first_name, last_name, id }) => ({
      name: [first_name + " " + last_name],
      value: id,
    }));
    //   console.log(ManagerArray);
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Choose Employee To Update",
          choices: employeeArray,
        },
      ])
      .then((data) => {
        RoleUpdateArray = [data];
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
                message: "Choose Employee's New Role",
                choices: roleArray,
              },
            ])
            .then((roleData) => {
              //   push role to data array
              RoleUpdateArray.push(roleData);
              // update role query
              const sql = `UPDATE employee SET role_id = ?
              WHERE id = ?`;
              // get employee id and role id from array
              const [{ id }, { role_id }] = RoleUpdateArray;
              console.log(id, role_id);
              params = [role_id, id];
              db.query(sql, params, (err, results) => {
                if (err) throw err;
                console.log("Employee Role Updated!");
                getEmployee();
              });
            });
        });
      });
  });
};

const getAllRoles = () => {
  const rolesql = `SELECT role.id, role.title FROM role`;

  db.query(rolesql, (err, rows) => {
    if (err) throw err;
    const table = cTable.getTable("Roles", rows);
    console.table(table);
  });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "title",
        type: "input",
        message: "What is the title of the new role?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary of the new role?",
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
            console.log(newRoleArray);
            // add db query to add role to db
            const [{ title, salary }, { department_id }] = newRoleArray;
            const sql = `INSERT INTO role (title, salary, department_id)
            VALUES (?,?,?)`;
            params = [title, salary, department_id];
            db.query(sql, params, (err, result) => {
              if (err) throw err;
              console.log("New role added!");
              getAllRoles();
            });
          });
      });
    });
};

const getDepartment = () => {
  const sql = `SELECT department.id, department.name FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    const table = cTable.getTable("Departments", rows);
    console.table(table);
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "name",
        type: "input",
        message: "What is the name of the new Department?",
      },
    ])
    .then((data) => {
      const sql = `INSERT INTO department (name)
    VALUE(?)`;

      params = [data.name];
      db.query(sql, params, (err, result) => {
        if (err) throw err;
        console.log("New department added!");
        getDepartment();
      });
    });
};

module.exports = {
  getEmployee,
  addEmployee,
  updateEmployee,
  getAllRoles,
  addRole,
  getDepartment,
  addDepartment,
};
