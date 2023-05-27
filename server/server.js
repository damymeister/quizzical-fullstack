require('dotenv').config()
const userRoutes = require("./Routes/users")
const authRoutes = require("./Routes/auth")
const resultRoutes = require("./Routes/results")
const express = require("express")
const app = express()
const dbConnect = require("./db_connection.js")
const cors = require('cors')
app.use(cors())
const bodyParser = require("body-parser");

app.use(bodyParser.json());
dbConnect();

app.use(express.json())
app.use("/api/users", userRoutes)
app.use("/api/auth", authRoutes)
app.use("/results", resultRoutes)

app.listen(5000, () => {
  console.log("Server started on port 5000")
});