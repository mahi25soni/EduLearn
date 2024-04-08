const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const otpGenerator = require('otp-generator')
// const { v4: uuidv4 } = require('uuid');

const {Users}  = require("../models/userModel")
const {sendEmail, createMessage} = require("../config/sendGridConfig");
require("dotenv").config();

const sendOtpViaEmail = (user) => {
    const msg = createMessage(user.email, user.otp)
    sendEmail(msg);

    setTimeout(async function() {
        try {
            user.otp = 0;
            console.log('userToken removed successfully after 30 seconds');
            user.save();
        } catch (error) {
            console.error('Error removing userToken:', error);
        }
    }, 30 * 1000); 
}
const otpVerification = (isUser, otp) => {
    if(!isUser) {
        return {
            status : 404, 
            valid : false,
            message : "No User Exists on this email"
        }
    }

    if(isUser.otp === 0) {
        return {
            status : 409,
            valid : false,
            message : "OTP expired, try again!"
        }    
    }

    if(isUser.otp !== otp){
        return {
            status : 410,
            valid : false,
            message : "OTP doesn't match, try again!"
        }
    }

    return {
        status : 200,
        valid : true,
        message : ""
    }
}
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

        // sendOtpViaEmail(new_user)

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

const userSignUpVerify = async (req, res) => {
    try{
        const {email, otp} = req.body;
        const isUser = await Users.findOne({email : email})

        const {status, valid, message } = otpVerification(isUser, otp)

        if(!valid) {
            return res.status(status).json({
                success : valid,
                message
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
                    role : isUser.role,
                    active : isUser.active
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
                        res.cookie(process.env.TOKEN_NAME, result, cookie_option)
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

        const {email} = req.body
        const isUser = await Users.findOne({email : email})
        if(!isUser) {
            return res.status(404).json({
                success : false,
                message : "This user doesn't exists!"
            })
        }

        const otp = otpGenerator.generate(6, {
            upperCaseAlphabets : false,
            lowerCaseAlphabets : false,
            specialChars : false
        })
        isUser.otp = otp;
        isUser.save();
        console.log("yaha tak chala kya?", isUser)
        sendOtpViaEmail(isUser)

        // redirect to forgotPasswordVefiryURL
        res.json({
            message : "First part done, email sent",
            data : isUser
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while forgot password!"
        })
    }
}

const forgotPasswordVerify = async (req, res) => {
    try{
        const {email, otp} = req.body;
        const isUser = await Users.findOne({email : email})

        const {status, valid, message } = otpVerification(isUser, otp)

        if(!valid) {
            return res.status(status).json({
                success : valid,
                message : message
            })
        }
        // OTP matched
        // Redirect to setNewPassword
        res.json({
            message : "second part done, otp verified",
            data : isUser
        })

    }
    catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}
const setNewPassword = async(req, res) => {
    try{
        const {email, new_password} = req.body;
        console.log("New shit is ", req.body)
        const isUser = await Users.findOne({email : email})
        if(!isUser) {
            return res.status(404).json({
                success : false,
                message : "This user doesn't exists!"
            })
        }
        const hash_pass = await bcrypt.hash(new_password, 10)
        const updated_user = await Users.findByIdAndUpdate({_id : isUser._id} , {password : hash_pass}, {new : true})

        res.status(200).json({
            success : true,
            message : "Password upated!",
            data : updated_user
        })

    } catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}

const resetPassword = async (req, res) => {
    try{
        const {_id, old_password, new_password} = req.body;

        const user = await Users.findOne(_id)

        if (await bcrypt.compare(old_password, user.password)) {

            const hash_pass = await bcrypt.hash(new_password, 10)
            await Users.findOne({_id : _id}, {password : hash_pass}, {new : true})

            res.status(200).json({
                success : true,
                message : "Password reset successfully!"

            })
        }
        else{
            return res.status(401).json({
                success : false,
                message : "Enter the correct old password"
            }) 
        }
    }
    catch(error) {
        return res.status(500).json({
            success : false,
            message : "Unknown error while log in!"
        })
    }
}



module.exports = {
    userSignUp,
    userSignUpVerify,

    userLogIn, 

    userForgotPassword,
    forgotPasswordVerify,
    setNewPassword,

    resetPassword

}
