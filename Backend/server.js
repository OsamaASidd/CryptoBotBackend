import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cookieParser from 'cookie-parser';
import { Client } from 'ssh2'

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());



// const connection = mysql.createConnection({
//     user: 'f4r4z',
//     password: 'Karachi123!',
//     host: 'f4r4z.mysql.pythonanywhere-services.com',
//     database: 'f4r4z$binance',
//    });
    
//    connection.connect((err) => {
//     if (err) {
//        console.error('Error connecting to MySQL database:', err);
//        return;
//     }
//     console.log('Connected to MySQL database');
//    });
   
   const sshConfig = {
    host: 'ssh.pythonanywhere.com',
    port: 22,
    username: 'f4r4z',
    password: 'Karachi123!'
  };
  const mysqlConfig = {
    user: 'f4r4z',
    password: 'Karachi123!',
    host: 'f4r4z.mysql.pythonanywhere-services.com',
    port: 3306,
    database: 'f4r4z$binance'
  };
  
  // Create an SSH tunnel
  const tunnel = new Client();
  tunnel.on('ready', () => {
    console.log('SSH tunnel established');
    console.log('waiting for sql connection to establish..');
    // Create a MySQL connection through the SSH tunnel
    const connection = mysql.createConnection(mysqlConfig);
    connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL database:', err);
        tunnel.end();
        return;
      }
      console.log('Connected to MySQL database');
      // Do stuff with the MySQL connection
      connection.end();
      // Close the SSH tunnel
      tunnel.end();
    });
  });
  tunnel.on('error', (err) => {
    console.error('SSH tunnel error:', err);
  });
  tunnel.connect(sshConfig);

const salt = 82
app.post('/register', (req, res) => {
    const sql = "INSERT INTO login (firstName,lastName, email, password) VALUES (?)";
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
      if (err) {
        return res.status(500).json({ error: "Error hashing password" });
      }
      const values = [
        req.body.firstName,
        req.body.lastName,
        req.body.email,
        hash
      ];
      db.query(sql, [values], (err, result) => {
        if (err) {
            console.log(err);
          return res.status(500).json({ error: "Error inserting data into database" });
        }
        return res.json({ status: "Success" });
      });
    });
  });
  

app.listen(8081,()=>{
    console.log("Running");
})
