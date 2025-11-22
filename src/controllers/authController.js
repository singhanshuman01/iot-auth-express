import userModel from "../models/userModel.js";
import adminModel from "../models/adminModel.js";
import jwt from "../utils/jwt.js";

async function handleUserLogin(req,res){
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
            res.redirect('/user/dashboard');
        }else{
            res.render('user_login', {
                message: "Wrong credentials"
            });
        }
    } catch (err) {
        console.error(err);
    }
}

async function handleAdminLogin(req, res) {
    const { admin_name, admin_password } = req.body;
    try {
        const adminVerified = await adminModel.verifyAdmin(admin_name, admin_password);
        if (adminVerified) {
            req.session.admin = admin_name;
            res.redirect('/admin/dashboard');
        } else {
            res.redirect('/auth/admin');
        }
    } catch (e) {
        console.error(e);
    }
}

export default { handleAdminLogin, handleUserLogin };