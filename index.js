const express = require("express")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
require("dotenv").config();

const dbConnect = require("./config/dbConnection")
const cloudConnect = require("./config/cloudinarySetup")
const userRoute = require("./routes/userRoute")
const courseRoute = require("./routes/courseRoute");
const { authentic } = require("./middlewares/userAuth");
const reviewRatingRoute = require("./routes/reviewRatingRoute")



const PORT = process.env.PORT || 3000;

const app = express();
app.use(cookieParser())
app.use(express.json())
app.use(bodyParser.urlencoded({extended : true}))

app.use("/api/auth", userRoute)
app.use("/api/course/", authentic, courseRoute)
app.use("/api/review/", reviewRatingRoute)



dbConnect();
cloudConnect();

app.listen(PORT, () => {
    console.log("The server is working")
})