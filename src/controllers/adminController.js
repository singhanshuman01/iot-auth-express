import { relayOccupied, updateSession } from '../utils/chargingSessionInfo.js';
import userModel from '../models/userModel.js';
import { io } from '../services/websocket.js';
import espHandler from '../services/espHandler.js';

async function createUser(req, res) {
    const { username, password } = req.body;
    try {
        if(!req.session.admin) return res.redirect('/auth/admin');
        const userExists = await userModel.isUser(username);
        if(userExists) return res.redirect('/admin/dashboard');
        const result = await userModel.createUser(username, password);
        if (!result) return res.status(500).send("Internal server error");
        res.redirect('/admin/dashboard?user=created');
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
        
        await espHandler.turnRelayOff(relayOccupied(uid));

        userModel.cancelTimeout(uid);
        updateSession(relaynum, 0, 'off');

        io.to(`user_${uid}`).emit("terminated");
        io.except(`user_${uid}`).emit('relay-free', relayOccupied(uid));
        
        res.redirect("/admin/dashboard");
    } catch (e) {
        console.error("Error in terminating user session: ", e);
    }
}

export default { createUser, terminateUserSession };