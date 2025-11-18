import axios from 'axios';
import userModel from '../models/userModel.js';
import { getSession, updateSession } from '../utils/chargingSessionInfo.js';

const nodemcuIP = process.argv[2];

const sess = getSession();

const displayUserDashboard = async function (req, res) {
    const user_id = req.id;
    const b = sess.findIndex(relay=>relay.uid===user_id);
    // const espResponse = await axios.get(`http://${nodemcuIP}/status`, {
    //     headers: {'X-api-key': process.env.ESP_END_SECRET}
    // });
    const logs = await userModel.getUserLogs(req.id);
    // await Promise.all([logs, isUsing])
    res.render('success', {
        isUsing: b!==-1,
        logs: logs
    });
}

const startCharging = async function (req, res) {
    try {
        console.log(`Going to ${nodemcuIP}`);
        
        // const espResponse = await axios.get(`http://${nodemcuIP}/relay_on`, {
        //     headers: {'X-api-key': process.env.ESP_END_SECRET}
        // });
        // console.log(espResponse);
        updateSession(0, req.id, 'on');
        res.redirect('/success');
    } catch (err) {
        console.error("Error in starting charging: ", err.message);
    }
}

const stopCharging = async function (req, res) {
    try {
        b = false;
        // const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
        //     headers: {'X-api-key': process.env.ESP_END_SECRET}
        // });
        // console.log(espResponse);
        updateSession(0, null, 'off');
        res.redirect('/success');
    } catch (err) {
        console.error("Error in stopping charging: ", err);
    }
}

export default { startCharging, stopCharging, displayUserDashboard };