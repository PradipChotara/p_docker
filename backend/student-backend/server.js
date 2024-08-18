const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
  host: 'mysql', // MySQL service name defined in Docker Compose
  user: 'root',
  password: 'password',
  database: 'studentdb'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
  console.log('Connected to MySQL database');
});

// Route to handle form submissions
app.post('/register', (req, res) => {
  const { name, rollNumber } = req.body;
  if (!name || !rollNumber) {
    return res.status(400).json({ message: 'Name and roll number are required.' });
  }

  const query = 'INSERT INTO students (name, roll_number) VALUES (?, ?)';
  connection.query(query, [name, rollNumber], (err) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).json({ message: 'Failed to register student.' });
    }
    res.status(200).json({ message: 'Student registered successfully!' });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
