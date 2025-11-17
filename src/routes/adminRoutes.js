import express from 'express';
import expressSession from 'express-session';
import adminController from '../controllers/adminController.js';
import adminModel from '../models/adminModel.js';

const router = express.Router();
router.use(expressSession({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        sameSite: true,
        maxAge: 1000*60*15,
        httpOnly: true,
    }
}));

router.get('/admin', (req, res) => {
    res.render('admin');
}).post('/admin', adminController.handleLogin);

router.get('/admin-dashboard', async (req, res) => {
    try {
        const admin = req.session?.admin || null;
        if(!admin) return res.redirect('/admin');
        const logs = await adminModel.getLogs();
        res.render('status', {logs: logs});
    } catch (e) {
        console.error(e);
        res.redirect('/admin');
    }
});

router.post('/create-user', adminController.createUser);

router.post('/admin-logout', (req,res)=>{
    req.session.destroy();
    res.redirect('/admin');
})

export default router;