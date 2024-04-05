const {Users}  = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const userSignUp = async (req, res) => {
    try{
        // const {username, email, phone_number, role, password} = req.body;
        
        const emailCheck = await Users.findOne({email : req.body.email})

        if(emailCheck) {
            return res.status(409).json({
                success : false,
                message : "User already exists! Try another email"
            })
        }
        // Email and password aren't empty, can be made sure from frontend
        const hash_pass = await bcrypt.hash(req.body.password, 10);
        const new_user = await Users.create({
            ...req.body,
            password : hash_pass
        })


        res.status(201).json({
            success : true,
            message : "User added successfully!",
            data : new_user
        })

    } catch(error) {
        console.log(error.message)
        return res.status(500).json({
            success : false,
            message : "Unknown error while sign in!"
        })
    }
}

const userLogIn = async (req, res) => {
    try{
        const {email, password} = req.body;

        const isUser = await Users.findOne({email})
        if(!isUser) {
            return res.status(404).json({
                success : false,
                message : "This user doesn't exists!"
            })
        }

        bcrypt.compare(password, isUser.password, (err, result) => {
            if(err){
                return res.status(401).json({
                    success : false,
                    message : "Wrong Password. Retry!"
                })
            }
            else{
                const payload = {
                    username : isUser.username,
                    email : isUser.email,
                    role : isUser.role
                }

                jwt.sign(payload, process.env.JWT_SECRET_KEY, (err, result) => {
                    if(err) {
                        return res.status(401).json({
                            success : false,
                            message : "Error while creating jwt token"
                        }) 
                    }
                    else{
                        // cookie creation
                        const cookie_option = {
                            expires : new Date(Date.now() + 3*24*60*60*1000),
                            httpOnly : true
                        }
                        res.cookie("login_token", result, cookie_option)
                        res.status(200).json({
                            success : true,
                            message : "Login Successfully!"
                        })
                    }
                })
            }
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}

const userForgotPassword = async (req, res) => {
    try{

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while forgot password!"
        })
    }
}

const userVerify = async (req, res) => {
    try{

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while verifying user!"
        })
    }
}

module.exports = {
    userSignUp,
    userLogIn, 
    userForgotPassword,
    userVerify
}
