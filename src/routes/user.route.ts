import { Router } from "express";
const router = Router()

import { forgotPassword, resetPassword, signIn, signUp } from "../controllers/user.controller";

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/forgot', forgotPassword)
router.patch('/reset', resetPassword)

export default router