import userModel from '../models/userModel.js';
import dbLogs from '../db/dbLogs.js';
import { updateSession, relayOccupied} from '../utils/chargingSessionInfo.js';
import { io } from '../services/websocket.js';
import espHandler from '../services/espHandler.js';

async function displayUserDashboard(req, res) {
    const [userOccupiedRelay, allRelayStatus]  = [relayOccupied(req.id), relayOccupied()];
    const logs = await dbLogs.getLogs(req.id);
    res.render('user_dashboard', {
        isUsing: userOccupiedRelay !== -1,
        relays: allRelayStatus,
        logs: logs
    });
}

async function startCharging(req, res) {
    try {
        if(relayOccupied(req.id)!=-1){                              //check if relay is occupied by user
            res.json({"error":"already busy"});
            return;
        }

        let { time, relay } = req.body;
        time = Number(time);
        relay = (relay==='0')? 0: (relay==='1')?1:null;             //assign number values to relay

        const requestedRelayInfo = relayOccupied(); 
        if(requestedRelayInfo[relay]=='on'){                        //if relay is already occupied by someone else
            res.redirect("/user/dashboard?error=busy");
        }



        const response = updateSession(relay, req.id, 'on', time);
        if(response["error"]){
            res.redirect('/user/dashboard');
            return;
        }

        let logs = dbLogs.createLog(req.id, time);
        let esp = espHandler.turnRelayOn(relay, req.id);

        await Promise.all([logs, esp]);
        
        io.except(`user_${req.id}`).emit('relay-busy', relay, req.id);
        io.to(`user_${req.id}`).emit('displayStopForm');

        userModel.stopChargingTimeout(time, req.id);                //set timeout to turn the relay off after 'time' minutes

        res.redirect(`/user/dashboard?status=success&time=${time}`);
    } catch (err) {
        console.error("Error in starting charging: ", err.message);
    }
}

async function stopCharging(req, res) {
    try {
        const relay = relayOccupied(req.id);
        if(relay==-1) return res.redirect('/user/dashboard');       //If no relay occupied by user
        await espHandler.turnRelayOff(relay);
        
        userModel.cancelTimeout(req.id);                            //clear the timeout

        updateSession(relay, 0, 'off');                     
                
        io.except(`user_${req.id}`).emit('relay-free', relay);
        io.to(`user_${req.id}`).emit('resetForm');
        
        res.redirect('/user/dashboard?status=stopped');
    } catch (err) {
        console.error("Error in stopping charging: ", err);
    }
}

function userLogout(req,res){
    try{
        res.clearCookie("token");
        res.redirect('/auth/user');
    } catch (e){
        console.error("Error loggin out user: ", e);
    }
}

export default { userLogout, startCharging, stopCharging, displayUserDashboard };