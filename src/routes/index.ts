import { Router } from "express";

// import sub-routers
import userRouter from './user.route'

const router: Router = Router();

router.use('/user', userRouter);

// Export the router
export default router;