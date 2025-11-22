import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/auth/user', (req,res)=>{
    res.render('user_login');
}).post('/auth/user', authController.handleUserLogin);

router.get('/auth/admin', (req,res)=>{
    res.render('admin_login');
}).post('/auth/admin', authController.handleAdminLogin);

export default router;