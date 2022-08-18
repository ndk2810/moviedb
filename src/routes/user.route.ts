import { Router } from "express";
const router = Router()

import { forgotPassword, rateMovie, resetPassword, signIn, signUp } from "../controllers/user.controller";

router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/forgot', forgotPassword)
router.post('/rate', rateMovie)
router.patch('/reset', resetPassword)

export default router