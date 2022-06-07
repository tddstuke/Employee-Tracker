const db = require("../db/connection");
const inquirer = require("inquirer");

const updateEmployee = (getEmployee, initialQuery) => {
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
              // console.log(id, role_id);
              params = [role_id, id];
              db.query(sql, params, (err, results) => {
                if (err) throw err;
                console.log("Employee Role Updated!");
                getEmployee(initialQuery);
              });
            });
        });
      });
  });
};
const updateManager = (getEmployee, initialQuery) => {
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
        ManagerUpdateArray = [data];

        // console.log(roleArray);
        inquirer
          .prompt([
            {
              name: "manager_id",
              type: "list",
              message: "Choose Employee's new manager",
              choices: employeeArray,
            },
          ])
          .then((data) => {
            //   push role to data array
            ManagerUpdateArray.push(data);
            // update role query
            const sql = `UPDATE employee SET manager_id = ?
                WHERE id = ?`;
            // get employee id and manager id from array
            const [{ id }, { manager_id }] = ManagerUpdateArray;
            // console.log(id, role_id);
            params = [manager_id, id];
            db.query(sql, params, (err, results) => {
              if (err) throw err;
              console.log("Employee Manager Updated!");
              getEmployee(initialQuery);
            });
          });
      });
  });
};

module.exports = { updateEmployee, updateManager };
