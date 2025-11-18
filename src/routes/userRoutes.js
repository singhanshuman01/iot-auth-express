import express from 'express';
import userController from '../controllers/userController.js';
import tokenCheck from '../middlewares/verifyjwt.js';

const router = express.Router();

router.get('/success', tokenCheck, userController.displayUserDashboard);

router.post('/start-charging', tokenCheck, userController.startCharging);
router.post('/stop-charging', tokenCheck, userController.stopCharging);

export default router;