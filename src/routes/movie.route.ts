import { Router } from "express";
const router = Router()

import { addMovie, getList, getMovie } from "../controllers/movie.controller";

router.get('/getList', getList)
router.post('/add', addMovie)
router.get('/:id', getMovie)

export default router