const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const {
  deleteEmployee,
  deleteRole,
  deleteDepartment,
} = require("./lib/delete");
const {
  getEmployee,
  addEmployee,
  updateEmployee,
  getAllRoles,
  addRole,
  getDepartment,
  addDepartment,
} = require("./lib/helper");

// original question array
const query_Array = [
  "View All Employees",
  "Add Employee",
  "Update Employee Role",
  "Delete An Employee",
  "View All Roles",
  "Add Role",
  "Delete a Role",
  "View All Departments",
  "Add Department",
  "Delete a Department",
  "Quit",
];
// original query
const initialQuery = () => {
  inquirer
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
        getEmployee(initialQuery);
      }
      if (answer.query_type === "Add Employee") {
        addEmployee(initialQuery);
      }
      if (answer.query_type === "Update Employee Role") {
        updateEmployee(initialQuery);
      }
      if (answer.query_type === "Delete An Employee") {
        deleteEmployee(getEmployee, initialQuery);
      }

      if (answer.query_type === "View All Roles") {
        getAllRoles(initialQuery);
      }
      if (answer.query_type === "Add Role") {
        addRole(initialQuery);
      }
      if (answer.query_type === "Delete a Role") {
        deleteRole(getAllRoles, initialQuery);
      }

      if (answer.query_type === "View All Departments") {
        getDepartment(initialQuery);
      }
      if (answer.query_type === "Add Department") {
        addDepartment(initialQuery);
      }
      if (answer.query_type === "Delete a Department") {
        deleteDepartment(getDepartment, initialQuery);
      }
      if (answer.query_type === "Quit") {
        process.exit();
      }
    });
};

initialQuery();
