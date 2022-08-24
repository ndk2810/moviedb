import { Router } from "express";
import { Constants } from "../config/constants";
import multer from "multer";

const router = Router()
const posterUpload = multer({ storage: Constants.POSTER_STORAGE })
const upload = multer({ storage: Constants.MEDIA_STORAGE })

import { addMedia, addMovie, addMovieGenre, deleteMovie, deleteMovieGenre, getList, getMovie, searchMovie, 
    searchMovieByActor, updateMovie, updateMoviePoster } 
    from "../controllers/movie.controller";
import { authorizeToken } from "../helpers/token";

router.get('/get-list', getList)
router.post('/add', authorizeToken, posterUpload.single('poster'), addMovie)
router.patch('/update', authorizeToken, updateMovie)
router.patch('/update-poster', authorizeToken, posterUpload.single('poster'), updateMoviePoster)
router.post('/add-media', authorizeToken, upload.array('media'), addMedia)
router.delete('/delete', authorizeToken, deleteMovie)
router.delete('/delete-genre', authorizeToken, deleteMovieGenre)
router.post('add-genre', authorizeToken, addMovieGenre)
router.get('/search', searchMovie)
router.get('/search-by-actor', searchMovieByActor)

router.get('/details/:id', getMovie)

export default router