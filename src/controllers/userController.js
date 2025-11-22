import axios from 'axios';
import userModel from '../models/userModel.js';
import dbLogs from '../db/dbLogs.js';
import { updateSession, relayOccupied} from '../utils/chargingSessionInfo.js';

const nodemcuIP = process.argv[2];
let timeoutId;

async function displayUserDashboard(req, res) {
    const user_id = req.id;
    const b = relayOccupied(user_id);
    const logs = await dbLogs.getLogs(user_id);
    res.render('success', {
        isUsing: b !== -1,
        logs: logs
    });
}

async function startCharging(req, res) {
    try {
        if(relayOccupied(req.id)){
            res.json({"error":"already busy"});
            return;
        }
        let { time, relay } = req.body;
        time = Number(time);
        relay = (relay==='0')? 0: (relay==='1')?1:null;

        const response = updateSession(relay, req.id, 'on', time);
        if(response["error"]){
            res.redirect('/user/dashboard');
            return;
        }

        console.log(`Going to ${nodemcuIP}`);

        let logs = await dbLogs.createLog(req.id, time);

        // let esp = axios.get(`http://${nodemcuIP}/relay_on`, {
        //     headers: { 'X-api-key': process.env.ESP_END_SECRET },
        //     params: {
        //         "relay": relay,
        //         "uid": req.id
        //     }
        // });
        // const [logsResponse, espResponse] = await Promise.all([logs, esp]);
        // espResponse = JSON.parse(espResponse);
        // console.log(espResponse);
        
        timeoutId = userModel.stopChargingAfterStarted(time, req.id);
        res.redirect('/user/dashboard');
    } catch (err) {
        console.error("Error in starting charging: ", err.message);
    }
}

async function stopCharging(req, res) {
    try {
        
        // const espResponse = await axios.get(`http://${nodemcuIP}/relay_off`, {
        //     headers: { 'X-api-key': process.env.ESP_END_SECRET },
        //     params: {
        //         "relay": getRelayNumByUID(req.id)
        //     }
        // });
        // console.log(JSON.parse(espResponse));
        clearTimeout(timeoutId);
        updateSession(relayOccupied(req.id), 0, 'off');
        res.redirect('/user/dashboard');
    } catch (err) {
        console.error("Error in stopping charging: ", err);
    }
}

export default { startCharging, stopCharging, displayUserDashboard };