const inquirer = require("inquirer");
const mysql = require("mysql2");
const sqlFunctions = require("./utils/index");
const useSqlFunction = new sqlFunctions();
require("console.table");
require("dotenv").config();

const db = mysql.createConnection(
  {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
  },
  console.log("Connected to the tracker_db database!")
);

const init = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View All Employees",
          "View All Roles",
          "View All Departments",
          "View Employee By Manager",
          "View Employee By Department",
          "Add Employee",
          "Add Role",
          "Add Department",
          "Updated Employee Role",
          "Quit",
        ],
      },
    ])
    .then((data) => {
      userInput(data);
    });
};

const userInput = (data) => {
  switch (data.choices) {
    case "View All Employees":
      viewAllEmployees();
      break;
    case "Add Employee":
      addEmployee();
      break;
    case "Updated Employee Role":
      updateEmployeeRole();
      break;
    case "Add Role":
      addRole();
      break;
    case "View All Roles":
      viewAllRoles();
      break;
    case "View All Departments":
      viewAllDepartment();
      break;
    case "Add Department":
      addDepartment();
      break;
    case "View Employee By Manager":
      viewEmployeeByManager();
      break;
    case "View Employee By Department":
      viewEmployeeByDepartment();
      break;
    default:
      console.log("Thank you! Goodbye! 👋");
      process.exit();
  }
};

const listNames = () => {
  const nameArray = [];
  const sql = useSqlFunction.listNames();
  return db
    .promise()
    .query(sql)
    .then(([results]) => {
      if (results.length === 0) {
        errorOccurred();
      } else {
        const fullNames = results.map(({ first, last }) => `${first} ${last}`);
        fullNames.forEach((name) => nameArray.push(name));
        return nameArray;
      }
    });
};

const roleChoices = () => {
  const titleChoices = [];
  const sql = useSqlFunction.roleChoices();
  return db
    .promise()
    .query(sql)
    .then(([results]) => {
      if (results.length === 0) {
        errorOccurred();
      } else {
        const titles = results.map((obj) => obj.title);
        titles.forEach((title) => titleChoices.push(title));
        return titleChoices;
      }
    });
};

const departmentSelections = () => {
  const departmentChoices = [];
  const sql = useSqlFunction.departmentSelections();
  return db
    .promise()
    .query(sql)
    .then(([results]) => {
      if (results.length === 0) {
        errorOccurred();
      } else {
        const departmentValues = results.map((obj) => obj.department);
        departmentValues.forEach((values) => departmentChoices.push(values));
        return departmentChoices;
      }
    });
};

const viewAllEmployees = () => {
  const sql = useSqlFunction.getAllEmployees();
  db.query(sql, (err, results) => {
    err ? errorOccurred() : console.table(`\n`, results, `\n`);
    init();
  });
};

const addRole = async () => {
  const departmentArray = await departmentSelections();
  inquirer
    .prompt([
      {
        name: "role",
        type: "input",
        message: "What is the role you want to add?",
      },
      {
        name: "salary",
        type: "input",
        message: "What is the salary for this role?",
      },
      {
        name: "departmentId",
        type: "list",
        choices: departmentArray,
      },
    ])
    .then((answers) => {
      const sql = useSqlFunction.addRole();
      const newRole = [answers.role, answers.salary, answers.departmentId];
      db.query(sql, newRole, (err, results) => {
        err
          ? errorOccurred()
          : console.info(
              `\n`,
              `You have successfully added the new role ${answers.role}!`,
              `\n`
            );
        init();
      });
    });
};

const addEmployee = async () => {
  const roleArray = await roleChoices();
  inquirer
    .prompt([
      {
        name: "first",
        type: "input",
        message: "What is the employee's first name?",
      },
      {
        name: "last",
        type: "input",
        message: "What is the employee's last name?",
      },
      {
        name: "roleId",
        type: "list",
        message: "What is the employee's role?",
        choices: roleArray,
      },
      {
        name: "managerId",
        type: "list",
        message: "Who is the employee's manager?",
        choices: ["John Doe", "Keith Wong", "David Chau", "Alice Pan"],
      },
    ])
    .then((input) => {
      const sql = useSqlFunction.addEmployee();
      const answers = [input.first, input.last, input.roleId, input.managerId];
      db.query(sql, answers, (err, results) => {
        err
          ? console.log(err)
          : console.info(
              "\n",
              `You have successfully added your name Employee, ${input.first} ${input.last}!`,
              `\n`
            );
        init();
      });
    });
};

const updateEmployeeRole = async () => {
  const roleArray = await roleChoices();
  const nameList = await listNames();
  inquirer
    .prompt([
      {
        name: "employeeName",
        type: "list",
        message: "Which employee's role do you want to update?",
        choices: nameList,
      },
      {
        name: "employeeRole",
        type: "list",
        message: "Which role would you like the assign to the employee?",
        choices: roleArray,
      },
    ])
    .then((choices) => {
      const sql = useSqlFunction.updateEmployeeRole();
      const selections = [choices.employeeRole, choices.employeeName];
      db.query(sql, selections, (err, results) => {
        err
          ? errorOccurred()
          : console.info(
              `\n`,
              `${choices.employeeName}'s role has been updated to ${choices.employeeRole}!`,
              `\n`
            );
        init();
      });
    });
};

const viewAllRoles = () => {
  const sql = useSqlFunction.viewAllRoles();
  db.query(sql, (err, results) => {
    err ? errorOccurred() : console.table("\n", results, `\n`);
    init();
  });
};

const viewAllDepartment = () => {
  const sql = useSqlFunction.viewAllDepartment();
  db.query(sql, (err, results) => {
    err ? errorOccurred() : console.table(`\n`, results, `\n`);
    init();
  });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "department",
        type: "input",
        message: "Enter a new department.",
      },
    ])
    .then((input) => {
      const sql = useSqlFunction.addDepartment();
      const values = [input.department];
      db.query(sql, values, (err, results) => {
        err
          ? errorOccurred()
          : console.info(
              `\n`,
              `You have successfully added a new department, ${input.department}!`,
              `\n`
            );
        init();
      });
    });
};

const viewEmployeeByManager = () => {
  const sql = useSqlFunction.viewEmployeeByManager();
  db.query(sql, (err, results) => {
    err ? errorOccurred() : console.table(`\n`, results, `\n`);
    init();
  });
};

const viewEmployeeByDepartment = () => {
  const sql = useSqlFunction.viewEmployeeByDepartment();
  db.query(sql, (err, results) => {
    err ? errorOccurred() : console.table(`\n`, results, `\n`);
    init();
  });
};

const errorOccurred = () => {
  console.info(`\n`, `There is an error! Please start again!`, `\n`);
  return;
};

init();
