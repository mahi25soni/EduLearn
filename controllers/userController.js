const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator')
// const { v4: uuidv4 } = require('uuid');

const {Users}  = require("../models/userModel")
const {sendEmail, createMessage} = require("../config/sendGridConfig");
require("dotenv").config();


const userSignUp = async (req, res) => {
    try{
        const emailCheck = await Users.findOne({email : req.body.email})

        if(emailCheck) {
            return res.status(409).json({
                success : false,
                message : "User already exists! Try another email"
            })
        }
        // Email and password aren't empty, can be made sure from frontend
        const hash_pass = await bcrypt.hash(req.body.password, 10);
        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        })

        const new_user = await Users.create({
            ...req.body,
            otp : otp,
            password : hash_pass
        })

        const msg = createMessage(new_user.email, new_user.otp)
        sendEmail(msg);

        setTimeout(async function() {
            try {
                new_user.otp = 0;
                console.log('userToken removed successfully after 30 seconds');
                new_user.save();
            } catch (error) {
                console.error('Error removing userToken:', error);
            }
        }, 30 * 1000); 

        // yaha res json ki jagah res.redirect better option rahega
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
        // check if the email is valid
        // sendEmail()
        // const {email} = req.body
        // const isUser = await Users.findOne({email : email})
        // if(!isUser) {
        //     return res.status(404).json({
        //         success : false,
        //         message : "This user doesn't exists!"
        //     })
        // }


        // const new_token_holder = await userToken.create();


        // res.redirec('/setFo')
        // const {otp, uniqueID} = getOtpUuid();
        // console.log(otp, uniqueID)
        // const new_user_token = await userToken.create({
        //     token_id : uniqueID, otp
        // })

        // setTimeout(async () => {
        //     try {
        //         await userToken.deleteOne({_id : new_user_token._id});
        //         console.log('userToken removed successfully after 30 seconds');
        //     } catch (error) {
        //         console.error('Error removing userToken:', error);
        //     }
        // }, 15 * 1000); // 30 seconds in milliseconds

        // console.log("s;lkdfj;slfdjs;ldkfj")
        // console.log(new_user_token)
        // res.send(new_user_token)

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while forgot password!"
        })
    }
}

const userVerify = async (req, res) => {
    try{
        const {email, otp} = req.body;
        const isUser = await Users.findOne({email : email})

        if(!isUser) {
            return res.status(409).json({
                success : false,
                message : "No User Exists on this email"
            })
        }

        if(isUser.otp === 0) {
            return res.status(410).json({
                success : false,
                message : "OTP expired, try again!"
            })          
        }

        if(isUser.otp !== otp){
            return res.status(401).json({
                success : false,
                message : "OTP doesn't match, try again!"
            })   
        }

        // OTP matched
        isUser.active = true;
        isUser.save();
        res.status(201).json({
            success : true,
            message : "User actived!",
            data : isUser
        })

    } catch(error) {
        console.log(error.message)

        return res.status(500).json({
            success : false,
            message : "Unknown error while verifying user!"
        })
    }
}

const updateUser = async (req, res) => {
    try{

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}

module.exports = {
    userSignUp,
    userLogIn, 
    userForgotPassword,
    userVerify
}
