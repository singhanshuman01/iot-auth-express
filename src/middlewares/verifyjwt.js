import jwt from "../utils/jwt.js";

const tokenCheck = function(req,res,next){
    try {
        const token = req.cookies.token;
        if(!token) return res.redirect('/login');
        const b = jwt.verifyToken(token);
        if(!b) return res.redirect('/login');
        return next()
    } catch (e) {
        console.error(e);
    }
}

export default tokenCheck;