import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/login', (req,res)=>{
    res.render('login');
}).post('/login', authController.handleLogin);

router.post('/logout', (req,res)=>{
    res.clearCookie('token');
    res.redirect('/login');
});

export default router;