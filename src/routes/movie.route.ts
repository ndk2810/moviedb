import { Router } from "express";
import { Constants } from "../config/constants";
import multer from "multer";

const router = Router()
const posterUpload = multer({ storage: Constants.POSTER_STORAGE })
const upload = multer({ storage: Constants.MEDIA_STORAGE })

import { addMedia, addMovie, deleteMovie, getList, getMovie, rateMovie, searchMovie, updateMovie, updateMoviePoster } from "../controllers/movie.controller";
import { authorizeToken } from "../helpers/token";

router.get('/getList', getList)
router.post('/add', posterUpload.single('poster'), addMovie)
router.patch('/update', updateMovie)
router.patch('/updatePoster', posterUpload.single('poster'), updateMoviePoster)
router.post('/addMedia', upload.array('media'), addMedia)
router.delete('/delete', deleteMovie)
router.post('/rate', rateMovie)
router.get('/search', searchMovie)

router.get('/details/:id', getMovie)

export default router