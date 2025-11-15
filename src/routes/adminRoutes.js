import express from 'express';
import adminController from '../controllers/adminController.js';

const router = express.Router();

router.get('/admin', (req,res)=>{
    res.render('admin');
}).post('/admin', adminController.handleLogin);

export default router;