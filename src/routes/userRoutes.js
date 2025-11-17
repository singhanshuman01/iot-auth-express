import express from 'express';
import userController from '../controllers/userController.js';
import tokenCheck from '../middlewares/verifyjwt.js';
import userModel from '../models/userModel.js';
import jwt from '../utils/jwt.js';

const router = express.Router();

router.get('/', (req,res)=>res.redirect('/success'));

router.get('/success', tokenCheck,async (req,res)=>{
    const logs =await userModel.getUserLogs(req.id);
    res.render('success', {
        logs: logs
    });
});

router.post('/start-charging', tokenCheck, userController.startCharging);
router.post('/stop-charging', tokenCheck, userController.stopCharging);

export default router;