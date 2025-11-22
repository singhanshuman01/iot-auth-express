import express from 'express';
import userController from '../controllers/userController.js';
import tokenCheck from '../middlewares/verifyjwt.js';

const router = express.Router();

router.get('/user/dashboard', tokenCheck, userController.displayUserDashboard);

router.post('/user/start-charging', tokenCheck, userController.startCharging);
router.post('/user/stop-charging', tokenCheck, userController.stopCharging);

router.post('/user/logout', tokenCheck, userController.userLogout);

export default router;