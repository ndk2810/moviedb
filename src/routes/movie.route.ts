import { Router } from "express";
const router = Router()

import { getMovie } from "../controllers/movie.controller";

router.get('/:id', getMovie)

export default router