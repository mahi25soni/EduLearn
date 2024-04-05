const express = require("express")
const dbConnect = require("./config/dbConnection")
require("dotenv").config();
const bodyParser = require("body-parser")

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))


dbConnect();

app.listen(PORT, () => {
    console.log("The server is working")
})