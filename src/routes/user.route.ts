import { Router } from "express";
const router = Router()

import { confirmAccount, deleteRating, forgotPassword, rateMovie, resetPassword, signIn, signUp } from "../controllers/user.controller";
import { authorizeToken } from "../helpers/token";

router.get('/confirm', confirmAccount)
router.post('/signUp', signUp)
router.post('/signIn', signIn)
router.post('/forgot', forgotPassword)
router.post('/rate', authorizeToken, rateMovie)
router.delete('/deleteRating', authorizeToken, deleteRating)
router.patch('/reset', resetPassword)

export default router