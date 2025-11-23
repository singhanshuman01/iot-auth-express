import express from 'express';
import expressSession from 'express-session';
import adminController from '../controllers/adminController.js';
import {relayOccupied} from '../utils/chargingSessionInfo.js';
import dbLogs from '../db/dbLogs.js';

const router = express.Router();

router.get('/admin', (req,res)=>res.redirect('/admin/dashboard'));

router.get('/admin/dashboard', async (req, res) => {
    try {
        if(!req.session.admin) return res.redirect('/auth/admin');
        const params = req.query;
        let msg = null;
        if(params["user"]){
            msg = "User created succesfully";
        }
        const logs = await dbLogs.getLogs();
        const sess = relayOccupied();
        res.render('admin_dashboard', {
            relayStatus: sess,
            logs: logs,
            msg: msg
        });
    } catch (e) {
        console.error(e);
        res.redirect('/admin/login');
    }
});

router.post('/admin/create-user', adminController.createUser);

router.post('/admin/terminate-session', adminController.terminateUserSession);

router.post('/admin/logout', (req,res)=>{
    req.session.destroy();
    res.clearCookie("connect.sid");
    res.redirect('/auth/admin');
})

export default router;