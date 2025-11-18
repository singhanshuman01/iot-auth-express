import adminModel from '../models/adminModel.js';
import userModel from '../models/userModel.js';
import { updateSession } from '../utils/chargingSessionInfo.js';
import axios from 'axios';

const nodemcuIP = process.argv[2];

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
        const admin = req.session?.admin || null;
        if(!admin) return res.redirect('/admin');
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

async function terminateUserSession(req,res){
    try {
        if(!req.session || !req.session.admin) return res.redirect('/admin');
        const {uid, relaynum} = req.body;
        const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
            headers: {
                'X-api-key': process.env.ESP_END_SECRET
            }
        });
        updateSession(relaynum, null, 'off');
        console.log(espResponse);
    } catch (e) {
        console.error("Error in terminating user session: ", e);
    }
}

export default { handleLogin, createUser, terminateUserSession };