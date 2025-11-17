import adminModel from '../models/adminModel.js';
import userModel from '../models/userModel.js';

async function handleLogin(req, res) {
    const { admin_name, admin_password } = req.body;
    try {
        const adminVerified = await adminModel.verifyAdmin(admin_name, admin_password);
        if (adminVerified) {
            req.session.admin = admin_name;
            res.redirect('/admin-dashboard');
        } else {
            res.redirect('/admin');
        }
    } catch (e) {
        console.error(e);
    }
}

async function createUser(req, res) {
    const { username, password } = req.body;
    try {
        const userExists = await userModel.getUser(username);
        if(userExists) return res.redirect('/admin-dashboard');
        const result = await adminModel.createUser(username, password);
        if (!result) return res.status(500).send("Internal server error");
        res.redirect('/admin-dashboard');
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server Error");
    }
}

export default { handleLogin, createUser };