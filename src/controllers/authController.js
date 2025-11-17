import userModel from "../models/userModel.js";
import jwt from "../utils/jwt.js";

async function handleLogin(req,res){
    const {username, password} = req.body;
    try {
        const checkUser = await userModel.verifyUser(username, password);
        if(checkUser==-1){
            return res.send('<h2>User doesn\'t exist, contact administrator</h2>');
        }else if(checkUser > 0){
            const token = jwt.createToken({uid: checkUser});
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: "strict",
                expiresIn: '7d',
            });
            res.redirect('/success');
        }else{
            res.render('login', {
                message: "Wrong credentials"
            });
        }
    } catch (err) {
        console.error(err);
    }
}

export default {handleLogin};