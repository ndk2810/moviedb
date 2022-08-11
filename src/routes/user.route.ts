import { Router } from "express";
const router = Router()

import { signIn, signUp } from "../controllers/user.controller";

router.post('/signUp', signUp)
router.post('/signIn', signIn)

export default router