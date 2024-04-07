const jwt = require("jsonwebtoken")

const authentic = (req, res, next) => {
    try{
        const token = req.cookies[process.env.TOKEN_NAME]
        if(!token) {
            return res.status(401).json({
                success : false,
                message : "Login!"
            }) 
        }

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

const isInstructor = (req, res, next) => {
    try{
        console.log("lsdjfksldfkjsdf ", req.user)
        if(req.user.role != "INSTRUCTOR") {
            return res.status(401).json({
                success : false,
                message : `Only instructor can use this functionality `
            })   
        }
        next();

    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : `Internal error while authorizing you as instructor`
        })
    }
}

const isStudent = (req, res, next) => {
    try{
        console.log("lsdjfksldfkjsdf ", req.user)
        if(req.user.role != "STUDENT") {
            return res.status(401).json({
                success : false,
                message : `Only Student can use this functionality `
            })   
        }
        next();

    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : `Internal error while authorizing you as Student`
        })
    }
}

const isAdmin = (req, res, next) => {
    try{
        console.log("lsdjfksldfkjsdf ", req.user)
        if(req.user.role != "ADMIN") {
            return res.status(401).json({
                success : false,
                message : `Only Admin can use this functionality `
            })   
        }
        next();

    }
    catch(error) {
        console.log(error.message)
        res.status(500).json({
            success : false,
            message : `Internal error while authorizing you as Admin`
        })
    }
}
module.exports = {
    authentic,
    isInstructor,
    isStudent,
    isAdmin
}