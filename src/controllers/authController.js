import userModel from "../models/userModel.js";
import jwt from "../utils/jwt.js";

async function handleLogin(req,res){
    const {username, password} = req.body;
    try {
        const checkUser = await userModel.verifyUser(username, password);
        if(checkUser){
            const token = jwt.createToken({uid: checkUser});
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: "strict",
                expiresIn: '7d',
            });
            res.redirect('/success');
        }else{
            res.redirect('/login');
        }
    } catch (err) {
        console.error(err);
    }
}

export default {handleLogin};