const express = require("express");
const router2 = express.Router();
const mysql = require('mysql2');
const callPythonFunction = require('../../temp2');

const connection = mysql.createConnection({
    host: "localhost",
    user: 'aboomi',
    password: "abumi ni mzi",
    database: "Users"
});


connection.connect((err) => {
    if (err) {
        console.error("Failed to connect:", err);
        return;
    } else {
        console.log("Connected to the db");
    }
});

router2.post("/predict", (req, res) => {
    const age = req.body.age;
    const bmi = req.body.bmi;
    const blood_sugar = req.body.blood_sugar;
    let gender = req.body.gender

    if(!age || !bmi || !blood_sugar || !gender) {
        res.statusMessage({message: "Missing data"}, 401);
    }
    if (gender === "Male") {
        gender = 0;
    }
    else {
        gender = 1;
    }

    const dat = {age: [age], bmi: [bmi], blood_sugar_level: [blood_sugar], gender: [gender]};
    
    callPythonFunction(dat)
    .then((result) => {
        const outcome = result[0];
        let query = `Insert into data_table (age, bmi, blood_sugar_level, outcome, gender) VALUES (?, ?, ?, ?, ?)`;
        let gen = req.body.gender;
        if (req.body.gender === "Male") {
            gen = "M";
        }
        else {
            gen = "F"
        }
        let values = [
            age,
            bmi,
            blood_sugar,
            outcome,
            gen
        ]
        connection.query(query, values, (err, results) => {
            if (err) {
                console.error("Error inserting row:", err);
                res.status(403).json({ error: "Forbidden" });
            } else {
                console.log("Inserted row:", results);
                res.status(200).json({ message: "Success", diabetic_pred: outcome });
            }
        })
    }
    )
    .catch(error => res.send(error));
});

module.exports = router2