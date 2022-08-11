import { Router } from "express";
const router: Router = Router();

// Sub-routers
import userRouter from './user.route'

router.use('/user', userRouter);

export default router;