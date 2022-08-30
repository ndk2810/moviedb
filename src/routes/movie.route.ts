import { Router } from "express";
import { Constants } from "../config/constants";
import multer from "multer";

const router = Router()
const posterUpload = multer({ storage: Constants.POSTER_STORAGE })
const upload = multer({ storage: Constants.MEDIA_STORAGE })

import {
    addMedia, addMovie, addMovieGenre, deleteMovie, deleteMovieGenre, getList, getMovieActors, getMovieGenres, getMovieInfo, getMovieMedias, searchMovie,
    searchMovieByActor, updateMovie, updateMoviePoster
}
    from "../controllers/movie.controller";
import { authorizeToken } from "../helpers/token";
import { setPagination } from "../helpers/wrappers/pagination";

router.get('/get-list', setPagination, getList)
router.post('/add', authorizeToken, posterUpload.single('poster'), addMovie)
router.get('/search', setPagination, searchMovie)
router.get('/search-by-actor', setPagination, searchMovieByActor)

router.post('/:id/genre', authorizeToken, addMovieGenre)
router.delete('/:id/genre', authorizeToken, deleteMovieGenre)

router.post('/:id/media', authorizeToken, upload.array('media'), addMedia)

router.patch('/:id', authorizeToken, updateMovie)
router.patch('/:id/poster', authorizeToken, posterUpload.single('poster'), updateMoviePoster)
router.delete('/:id', authorizeToken, deleteMovie)

router.get('/:id/actors', getMovieActors)
router.get('/:id/genres', getMovieGenres)
router.get('/:id/medias', getMovieMedias)
router.get('/:id', getMovieInfo)

export default router