import { relayOccupied, updateSession } from '../utils/chargingSessionInfo.js';
import userModel from '../models/userModel.js';
import axios from 'axios';

const nodemcuIP = process.argv[2];

async function createUser(req, res) {
    const { username, password } = req.body;
    try {
        if(!req.session.admin) return res.redirect('/auth/admin');
        const userExists = await userModel.isUser(username);
        if(userExists) return res.redirect('/admin/dashboard');
        const result = await userModel.createUser(username, password);
        if (!result) return res.status(500).send("Internal server error");
        res.redirect('/admin/dashboard');
    } catch (e) {
        console.error(e);
        res.status(500).send("Internal server Error");
    }
}

async function terminateUserSession(req,res){
    try {
        if(!req.session || !req.session.admin) return res.redirect('/auth/admin');
        const { uid, relaynum } = req.body;
        if(!relayOccupied(uid)){
            throw new Error(`No relay occupied by uid: ${uid}`);
        }
        // const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
        //     headers: {
        //         'X-api-key': process.env.ESP_END_SECRET
        //     }
        // });
        userModel.cancelTimeout(uid);
        updateSession(relaynum, 0, 'off');
        // console.log(espResponse);
    } catch (e) {
        console.error("Error in terminating user session: ", e);
    }
}

export default { createUser, terminateUserSession };