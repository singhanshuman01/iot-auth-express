import jwt from "../utils/jwt.js";

const tokenCheck = async function(req,res,next){
    try {
        const token = req.cookies.token;
        if(!token) return res.redirect('/user/login');
        const b = jwt.verifyToken(token);
        if(!b) return res.redirect('/user/login');
        const {uid} = await jwt.decode(token);
        req.id = uid;
        return next()
    } catch (e) {
        console.error(e);
    }
}

export default tokenCheck;