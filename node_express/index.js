const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors())
app.use(express.urlencoded({extended: false}));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/diabetes', require('./routes/api/diabetes'));

app.listen(3000, () => {
    console.log("Server started at port 3000");
});