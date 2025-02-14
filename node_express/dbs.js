require('dotenv').config();
const mysql = require('mysql2');
const fs = require("fs");
const csv = require("csv-parser");


// Creates a MySQL connection
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connects to the database
connection.connect((err) => {
    if (err) {
        console.error("Failed to connect:", err);
        return;
    } else {
        console.log("Connected to the db");
    }
});

const query1 = "CREATE TABLE IF NOT EXISTS data_table (age INT, bmi FLOAT, blood_sugar_level INT, outcome INT, gender VARCHAR(5))";

connection.query(query1, (err, results) => {
    if (err) {
        console.error(err);
    }
    else {
        console.log(results);
    }
});

// Reads the CSV file
fs.createReadStream("balanced_diabetes_data.csv")
    .pipe(csv())
    .on('data', (row) => {
        // Parameterizing query to prevent SQL injection
        let query = `INSERT INTO data_table (age, bmi, blood_sugar_level, outcome, gender) 
                     VALUES (?, ?, ?, ?, ?)`;
        
        let values = [
            row.Age, 
            row.BMI, 
            row.BloodSugarLevel, 
            row.DiabetesOutcome, 
            String(row.Gender)
        ];

        connection.query(query, values, (err, results) => {
            if (err) {
                console.error("Error inserting row:", err);
            } else {
                console.log("Inserted row:", results);
            }
        });
    })
    .on('end', () => {
        connection.end();
    })
    .on('error', (err) => {
        console.error("Error reading CSV file:", err);
    });
