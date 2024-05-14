const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    try{
        // token will be received via the authorization header (Bearer token)
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token,process.env.JWT_KEY);
    }
    catch(error){
        return res.status(401).json({
            message: "Auth failed"
        });
    }
    next();
};