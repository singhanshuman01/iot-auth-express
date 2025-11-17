import express from 'express';
import expressSession from 'express-session';
import adminController from '../controllers/adminController.js';

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

router.get('/admin-dashboard', (req, res) => {
    try {
        const admin = req.session?.admin || null;
        if(!admin) return res.redirect('/admin');
        res.render('status');
    } catch (e) {
        console.error(e);
        res.redirect('/admin');
    }
});

router.post('/create-user', adminController.createUser);

export default router;