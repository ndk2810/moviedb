import { Router } from "express";
const router = Router()

import { addMovie, deleteMovie, getList, getMovie, rateMovie, searchMovie, updateMovie } from "../controllers/movie.controller";
import { authorizeToken } from "../helpers/token";

router.get('/getList', getList)
router.post('/add', authorizeToken, addMovie)
router.patch('/update', authorizeToken, updateMovie)
router.delete('/delete', authorizeToken, deleteMovie)
router.post('/rate', authorizeToken, rateMovie)
router.get('/search', searchMovie)

router.get('/details/:id', getMovie)

export default router