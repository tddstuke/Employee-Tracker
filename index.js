const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const {
  getEmployee,
  addEmployee,
  updateEmployee,
  getAllRoles,
  addRole,
} = require("./lib/helper");

// original question array
const query_Array = [
  "View All Employees",
  "Add Employee",
  "Update Employee Role",
  "View All Roles",
  "Add Role",
  "View All Departments",
  "Add Department",
];
// original query
const initialQuery = () => {
  return inquirer
    .prompt([
      {
        name: "query_type",
        type: "list",
        message: "What would you like to do?",
        choices: query_Array,
      },
    ])
    .then((answer) => {
      if (answer.query_type === "View All Employees") {
        getEmployee();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === "Add Employee") {
        addEmployee();
        // if ((addEmployee = true)) {
        //   setTimeout(() => {
        //     initialQuery();
        //   }, 1000);
        // }
      }
      if (answer.query_type === "Update Employee Role") {
        updateEmployee();
        // setTimeout(() => {
        //   initialQuery();
        // }, 1000);
      }
      if (answer.query_type === "View All Roles") {
        getAllRoles();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === "Add Role") {
        addRole();
        // setTimeout(() => {
        //   initialQuery();
        // }, 1000);
      }
      if (answer.query_type === "View All Departments") {
        getDepartment();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === "Add Department") {
        addDepartment();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
    });
};

initialQuery();
