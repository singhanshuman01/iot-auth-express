import adminModel from '../models/adminModel.js';
import jwt from '../utils/jwt.js';

async function handleLogin(req,res, next){
    const {admin_name, admin_password} = req.body;
    try {
        const status = await adminModel.verifyAdmin(admin_name, admin_password);
        if(status){
            const token = jwt.createToken({admin_name});
            res.cookie('token', token, {
                httpOnly: true,
                sameSite: 'strict'
            })
            res.redirect('/admin-dashboard');
        }else{
            res.redirect('/admin');
        }
    } catch (e) {
        console.error(e);
    }
}

export default {handleLogin};