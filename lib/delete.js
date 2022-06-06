const db = require("../db/connection");
const inquirer = require("inquirer");

const deleteEmployee = (getEmployee, initialQuery) => {
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
          message: "Choose Employee To Delete",
          choices: employeeArray,
        },
      ])
      .then((data) => {
        const params = [data.id];
        const sql = `DELETE FROM employee WHERE id = ?`;

        db.query(sql, params, (err, result) => {
          if (err) throw err;
          console.log("Employee Deleted!");
          getEmployee(initialQuery);
        });
      });
  });
};

const deleteRole = (getAllRoles, initialQuery) => {
  const sql = `SELECT role.id, role.title FROM role`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    const RoleArray = rows.map(({ title, id }) => ({
      name: title,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Choose Role To Delete",
          choices: RoleArray,
        },
      ])
      .then((data) => {
        const params = [data.id];
        const sql = `DELETE FROM role WHERE id = ?`;

        db.query(sql, params, (err, result) => {
          if (err) throw err;
          console.log("Role Deleted!");
          getAllRoles(initialQuery);
        });
      });
  });
};
const deleteDepartment = (getDepartment, initialQuery) => {
  const sql = `SELECT department.id, department.name FROM department`;

  db.query(sql, (err, rows) => {
    if (err) throw err;
    const departmentArray = rows.map(({ name, id }) => ({
      name: name,
      value: id,
    }));
    inquirer
      .prompt([
        {
          name: "id",
          type: "list",
          message: "Choose Department To Delete",
          choices: departmentArray,
        },
      ])
      .then((data) => {
        const params = [data.id];
        const sql = `DELETE FROM department WHERE id = ?`;

        db.query(sql, params, (err, result) => {
          if (err) throw err;
          console.log("Department Deleted!");
          getDepartment(initialQuery);
        });
      });
  });
};

module.exports = { deleteEmployee, deleteRole, deleteDepartment };
