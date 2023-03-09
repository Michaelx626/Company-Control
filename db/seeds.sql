INSERT INTO department (name)
VALUES ("Accounting"),
       ("Engineering"),
       ("Legal"),
       ("Marketing");

INSERT INTO role (title, salary, department_id)
VALUES ("Accounting Manager", "120000", 1),
       ("Accounts Payable", "65000", 1),
       ("Accounts Receivable", "70000", 1),
       ("Lead Engineer", "150000", 2),
       ("Software Engineer", "120000", 2),
       ("Data Analyst", "100000", 2),
       ("Lead Legal Team", "180000", 3),
       ("Lawyer", "150000", 3),
       ("Marketing Director", "150000", 4),
       ("Marketing Specialist", "75000", 4),
       ("Marketing Analyst", "80000", 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("John", "Doe", 1, NULL),
       ("Alexander", "Tran", 2, 1),
       ("Kenny", "Troung", 3, 1),
       ("Keith", "Wong", 4, NULL),
       ("Jenny", "Lee", 5, 4),
       ("Bonnie", "Duong", 6, 4),
       ("David", "Chau", 7, NULL),
       ("Daniel", "Mac", 8, 7),
       ("Alice", "Pan", 9, NULL),
       ("Peter", "Pan", 10, 9),
       ("Peter", "Griffin", 11, 9);
