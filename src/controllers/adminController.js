import { relayOccupied, updateSession } from '../utils/chargingSessionInfo.js';
import userModel from '../models/userModel.js';
import { io } from '../services/websocket.js';
import espHandler from '../services/espHandler.js';
import adminModel from '../models/adminModel.js';

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

async function deleteUser(req,res){
    try {
        if(!req.session || !req.session.admin) return res.redirect("/auth/admin");
        const {username, adminPassword} = req.body;

        const isVerified = await adminModel.verifyAdmin(req.session.admin, adminPassword);
        if(!isVerified) return res.status(400).json({"status": "error", "msg":"Admin credentials wrong"});

        const userExist = await userModel.isUser(username);
        if(!userExist) return res.status(400).json({"status": "error", "msg":"User doesn't exist"});

        const deleteStatus = await userModel.deleteUser(username);
        return res.status(200).json({"status": "ok"});

    } catch (e) {
        console.error("Error in admin controller - delete User: ", e);
        return res.status(500).json({"status":"error", "msg":"Internal server error"});
    }
}

export default { createUser, deleteUser, terminateUserSession };