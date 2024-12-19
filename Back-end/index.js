const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Project@12', 
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');

  db.query('CREATE DATABASE IF NOT EXISTS employee_management', (err, result) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    console.log('Database "employee_management" is ready');

    const dbWithDatabase = mysql.createConnection({
      host:'localhost',
      user: 'root',
      password: 'Project@12',
      database: 'employee_management',
    });
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS employees (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        employeeId UNIQUE VARCHAR(10) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(10) NOT NULL,
        department VARCHAR(50) NOT NULL,
        dateOfJoining DATE NOT NULL,
        role VARCHAR(100) NOT NULL
      );
    `;
    dbWithDatabase.query(createTableQuery,(err,result)=>{
      if(err){
        console.log("error creating the table",err);
        return;
      }
      else{
        console.log("employee table is ready!");
      }
    });
    app.post('/api/employees',(req,res)=>{
      const {name, employeeId, email, phone, department, dateOfJoining, role} = req.body;

      const query = `
      INSERT INTO employees(name,employeeId, email, phone, department, dateOfJoining, role)
      VALUES(?,?,?,?,?,?,?)
      `;
      dbWithDatabase.query(query,[name,employeeId,email,phone,department,dateOfJoining,role],(err,result)=>{
        if(err){
          res.status(500).json({message:"Error saving employee data."});
          return;
        }
        res.status(200).json({message:"Employee successfully added",id:result.insertId});
      });
    });
    app.listen(3000,()=>{
      console.log('Server running on http://localhost:3000');
    });
  });
});