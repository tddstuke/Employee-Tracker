class Employee {
  constructor(first_name = "", last_name = "", role_id = "", manager_id = "") {
    this.first_name = first_name;
    this.last_name = last_name;
    this.role_id = role_id;
    this.manager_id = manager_id;
  }
}
// Todo add getall delete and update functions to class
module.exports = Employee;
