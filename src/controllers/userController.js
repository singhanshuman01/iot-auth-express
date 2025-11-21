import axios from 'axios';
import userModel from '../models/userModel.js';
import { updateSession, getRelayNumByUID, getStatus } from '../utils/chargingSessionInfo.js';

const nodemcuIP = process.argv[2];

async function displayUserDashboard(req, res) {
    const user_id = req.id;
    const b = getRelayNumByUID(user_id);
    const [r1,r2] = getStatus();
    const logs = await userModel.getUserLogs(req.id);
    res.render('success', {
        isUsing: b !== -1,
        relays: [r1,r2],
        logs: logs
    });
}

async function startCharging(req, res) {
    try {
        let { time, relay } = req.body;
        time = Number(time);

        console.log(time, relay);
        updateSession(Number(relay), req.id, 'on');
        console.log(`Going to ${nodemcuIP}`);

        let logs = userModel.updateUserLogs(req.id, time);

        let esp = axios.get(`http://${nodemcuIP}/relay_on`, {
            headers: { 'X-api-key': process.env.ESP_END_SECRET },
            params: {
                "relay": relay,
                "uid": req.id
            }
        });
        const [logsResponse, espResponse] = await Promise.all([logs, esp]);
        espResponse = JSON.parse(espResponse);
        console.log(espResponse);
        
        userModel.stopChargingAfterStarted(time, req.id);
        res.redirect('/success');
    } catch (err) {
        console.error("Error in starting charging: ", err.message);
    }
}

async function stopCharging(req, res) {
    try {
        updateSession(getRelayNumByUID(req.id), null, 'off');
        const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
            headers: { 'X-api-key': process.env.ESP_END_SECRET },
            params: {
                "relay": getRelayNumByUID(req.id)
            }
        });
        console.log(JSON.parse(espResponse));
        res.redirect('/success');
    } catch (err) {
        console.error("Error in stopping charging: ", err);
    }
}

export default { startCharging, stopCharging, displayUserDashboard };