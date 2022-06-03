const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const getEmployee = require("./lib/helper");

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
      if (answer.query_type === query_Array[0]) {
        getEmployee();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === query_Array[1]) {
        addEmployee();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === query_Array[2]) {
        updateEmployee();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === query_Array[3]) {
        getAllRoles();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === query_Array[4]) {
        addRole();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === query_Array[5]) {
        getDepartment();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
      if (answer.query_type === query_Array[6]) {
        addDepartment();
        setTimeout(() => {
          initialQuery();
        }, 1000);
      }
    });
};

initialQuery();
