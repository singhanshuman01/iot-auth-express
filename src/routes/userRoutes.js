import express from 'express';
import userController from '../controllers/userController.js';

const router = express.Router();

router.get('/', (req,res)=>res.redirect('/login'));

router.get('/success', userController.startCharging)
.post('/success', userController.stopCharging);

export default router;