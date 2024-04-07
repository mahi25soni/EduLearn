const express = require("express")
const router = express.Router();
const {userSignUp, userLogIn, userForgotPassword, userVerify } = require("../controllers/userController")


router.post("/signup", userSignUp)
router.post("/login", userLogIn)
router.post("/forgot-password", userForgotPassword)
router.post("/verify", userVerify)


module.exports = router;