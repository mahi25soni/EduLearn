const jwt = require("jsonwebtoken")

const auth = (req, res, next) => {
    try{
        const token = req.cookies[process.env.TOKEN_NAME]
        if(!token) {
            return res.status(401).json({
                success : false,
                message : "Login!"
            }) 
        }

        console.log("the token is ", token)

        jwt.verify(token, process.env.JWT_SECRET_KEY, (error, result) => {
            if(error) {
                return res.status(401).json({
                    success : false,
                    message : "There is some problem with auth token!"
                }) 
            }
            else{
                if(result.active === false) {
                    return res.status(401).json({
                        success : false,
                        message : "SignUp to EduLearn to explore more!"
                    })    
                }
                req.user = result;
                next();
            }

        })
    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : "Internal error while authenticating!"
        })
    }
}


module.exports = {
    auth
}