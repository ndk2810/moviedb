import { Router } from "express";
const router = Router()

import { confirmAccount, deleteRating, forgotPassword, rateMovie, resetPassword, signIn, signUp } from "../controllers/user.controller";
import { authorizeToken } from "../helpers/token";

router.get('/confirm', confirmAccount)
router.post('/sign-up', signUp)
router.post('/sign-in', signIn)
router.post('/forgot', forgotPassword)
router.patch('/reset', resetPassword)

router.post('/:id/rate', authorizeToken, rateMovie)
router.delete('/:id/delete-rating', authorizeToken, deleteRating)

export default router