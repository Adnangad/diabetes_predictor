import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [age, setAge] = useState("");
  const [bmi, setBMI] = useState("");
  const [bloodGlucose, setBloodGlucose] = useState("");
  const [gender, setGender] = useState("");
  const [result, setResult] = useState(null);
  const [errorMes, setErrorMes] = useState("");

  const url = "http://localhost:3000/api/diabetes/predict";

  async function getOutput(event) {
    event.preventDefault();

    // Reset the result and error before fetching
    setResult(null);
    setErrorMes("");

    const data = {
      age: age,
      bmi: bmi,
      blood_sugar: bloodGlucose,
      gender: gender,
    };
    console.log(data);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseData = await response.json();
        setResult(responseData.diabetic_pred); 
      } else {
        setErrorMes("Unable to fetch results at this time.");
      }
    } catch (error) {
      setErrorMes("Network error. Please try again.");
    }
  }

  
  useEffect(() => {
    console.log(result); 
  }, [result]); 

  
  const resultStyle = result === 0 ? "no-diabetes" : result === 1 ? "has-diabetes" : "";

  return (
    <div className="container">
      <div className="card">
        <h2 className="heading">Diabetes Risk Predictor</h2>
        <form onSubmit={getOutput} className="form">
          <label className="label">Age:</label>
          <input
            type="number"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
            className="input"
          />

          <label className="label">BMI:</label>
          <input
            type="number"
            value={bmi}
            onChange={(e) => setBMI(e.target.value)}
            required
            className="input"
          />

          <label className="label">Blood Glucose Level:</label>
          <input
            type="number"
            value={bloodGlucose}
            onChange={(e) => setBloodGlucose(e.target.value)}
            required
            className="input"
          />

          <label className="label">Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
            className="select"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <button type="submit" className="button">
            Predict
          </button>
        </form>

        {result !== null && (
          <p className={`result ${resultStyle}`}>
            {result === 0 ? "No Diabetes" : "You have Diabetes"}
          </p>
        )}

        {errorMes && <p className="error">{errorMes}</p>}
      </div>
    </div>
  );
}
