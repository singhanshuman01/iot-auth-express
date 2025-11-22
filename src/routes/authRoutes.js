import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/auth/user', (req,res)=>{
    res.render('login');
}).post('/auth/user', authController.handleUserLogin);

router.get('/auth/admin', (req,res)=>{
    res.render('admin');
}).post('/auth/admin', authController.handleAdminLogin);

// router.post('/logout', (req,res)=>{
//     res.clearCookie('token');
//     res.redirect('/login');
// });

export default router;