import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

router.get('/login', (req,res)=>{
    res.render('login');
})
.post('/login', authController.handleLogin);

export default router;