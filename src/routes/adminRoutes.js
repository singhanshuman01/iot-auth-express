import express from 'express';
import expressSession from 'express-session';
import adminController from '../controllers/adminController.js';
import {relayOccupied} from '../utils/chargingSessionInfo.js';
import authController from '../controllers/authController.js';
import dbLogs from '../db/dbLogs.js';

const router = express.Router();
router.use('/admin' ,expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        path: '/admin',
        sameSite: true,
        maxAge: 1000*60*15,
        httpOnly: true,
    }
}));

router.get('/admin/login', (req, res) => {
    res.render('admin_login');
}).post('/admin/login', authController.handleAdminLogin);

router.get('/admin/dashboard', async (req, res) => {
    try {
        if(!req.session.admin) return res.redirect('/admin/login');
        const logs = await dbLogs.getLogs();
        const sess = relayOccupied();
        res.render('status', {
            relayStatus: sess,
            logs: logs
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
    res.redirect('/admin/login');
})

export default router;