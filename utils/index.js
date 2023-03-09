class sqlFunctions {
  getAllEmployees() {
    return `
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee employee
    LEFT JOIN employee manager ON employee.manager_id = manager.id
    JOIN role ON employee.role_id = role.id
    JOIN department ON role.department_id = department.id;
    `;
  }

  addRole() {
    return `INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))`;
  }

  addEmployee() {
    return `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, (SELECT id FROM role WHERE title = ?), (SELECT id FROM (SELECT * FROM employee) AS e WHERE CONCAT(e.first_name, ' ', e.last_name) = ?))`;
  }

  updateEmployeeRole(){
    return `UPDATE role SET title = ? WHERE id = (SELECT role_id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?)`;
  }

  viewAllRoles(){
    return `SELECT role.id, role.title, role.salary, department.name AS department FROM role LEFT JOIN department ON role.department_id = department.id`;
  }

  viewAllDepartment(){
    return `SELECT department.id, department.name AS department FROM department`;
  }

  addDepartment(){
    return `INSERT INTO department (name) VALUES (?)`;
  }

  departmentSelections(){
    return `SELECT department.name AS department from department`;
  }

  listNames(){
    return `SELECT employee.first_name AS first, employee.last_name AS last FROM employee`;
  }

  roleChoices(){
    return `SELECT role.title AS title FROM role`;
  }
}

module.exports = sqlFunctions;
