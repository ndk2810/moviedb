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
router.get('/search', searchMovie)
router.get('/search-by-actor', searchMovieByActor)

router.patch('/:id/update', authorizeToken, updateMovie)
router.patch('/:id/update-poster', authorizeToken, posterUpload.single('poster'), updateMoviePoster)
router.post('/:id/add-media', authorizeToken, upload.array('media'), addMedia)
router.delete('/:id/delete', authorizeToken, deleteMovie)
router.post('/:id/add-genre', authorizeToken, addMovieGenre)
router.delete('/:id/delete-genre', authorizeToken, deleteMovieGenre)
router.get('/:id', getMovie)

export default router