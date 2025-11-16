import express from 'express';
import adminController from '../controllers/adminController.js';
import jwt from '../utils/jwt.js';

const router = express.Router();

router.get('/admin', (req, res) => {
    res.render('admin');
}).post('/admin', adminController.handleLogin);

router.get('/admin-dashboard', (req, res) => {
    try {
        const token = req.cookies?.token;
        if (!token) return res.redirect('/admin');
        const verified = jwt.verifyToken(token);
        if (!verified) return res.redirect('/admin');
        res.clearCookie('token');
        res.render('status');
    } catch (e) {
        console.error(e);
        res.redirect('/admin');
    }
})

export default router;