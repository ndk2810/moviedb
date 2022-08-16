import { Router } from "express";
const router: Router = Router();

// Sub-routers
import userRouter from './user.route'
import movieRouter from './movie.route'

router.use('/user', userRouter);
router.use('/movie', movieRouter);

export default router;