import { plainToInstance } from "class-transformer"
import { RequestHandler } from "express"
import { QueryTypes, Sequelize } from "sequelize"
import { Constants } from "../config/constants"
import { sequelize } from "../config/database"
import { AddGenreToMovieDTO } from "../dtos/addmoviegenre.dto"
import { UpdateMovieDTO } from "../dtos/updatemovie.dto"
import { validateDTO } from "../dtos/validate"
import { execProc } from "../helpers/procedure"
import { Errors } from "../helpers/wrappers/errorWrapper"
import { paginate } from "../helpers/wrappers/pagination"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { Actor } from "../models/actor.model"
import { Movie } from "../models/movie/movie.model"
import { MovieActor } from "../models/movie/movieActor.model"
import { MovieGenre } from "../models/movie/movieGenre.model"
import { MovieMedia } from "../models/movie/movieMedia.model"
import { MovieScore } from "../models/movie/movieScore.model"

export const getMovie: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        if (!id)
            throw Errors.MISSING_ID

        const [updateScore, movie, actors, medias, genres] = await Promise.all([
            execProc("updateScore(:movieId)", { movieId: id }),
            Movie.findOne({ where: { id: id } }),
            MovieActor.findAll({ where: { movieId: id } }),
            MovieMedia.findAll({ where: { movieId: id } }),
            MovieGenre.findAll({ where: { movieId: id } }),
        ])

        if (!movie)
            throw Errors.NO_MOVIE

        medias.forEach(media => {
            media.url = Constants.ASSETS + media.url
        })
        movie.poster = Constants.ASSETS + 'posters/' + movie.poster

        return res.send(new ResponseWrapper(
            { movie, actors, medias, genres }, null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const addMovie: RequestHandler = async (req, res, next) => {
    try {
        if (!req.file)
            throw Errors.MISSING_FILE

        const movie: Movie = await Movie.create({
            title: req.body.title,
            overview: req.body.overview,
            poster: req.file.filename || "joker.jpg",
        })

        let movieActors, movieGenres

        if (req.body.movieactors) {
            const movieCast = JSON.parse(req.body.movieactors)
            const cast = movieCast.map((movieActor: { actorId: number; role: string }) => {
                return {
                    movieId: movie.id,
                    actorId: movieActor.actorId,
                    role: movieActor.role
                }
            })

            movieActors = await MovieActor.bulkCreate(cast)
        }

        if (req.body.moviegenres) {
            const jsonMoviegenres = JSON.parse(req.body.moviegenres)
            const genre = jsonMoviegenres.map((movieGenre: { genreId: number }) => {
                return {
                    movieId: movie.id,
                    genreId: movieGenre.genreId
                }
            })

            movieGenres = await MovieGenre.bulkCreate(genre)
        }

        return res.send(new ResponseWrapper(
            { movie, movieActors, movieGenres }, null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const updateMovie: RequestHandler = async (req, res, next) => {
    try {
        const data = {
            id: req.params.id,
            title: req.body.title,
        }

        const updateMovieDTO: UpdateMovieDTO = plainToInstance(UpdateMovieDTO, data)
        await validateDTO(updateMovieDTO)

        const movie = await Movie.findOne({
            where: { id: req.params.id }
        })

        await movie.update({
            title: req.body.title,
            overview: req.body.overview,
        })

        return res.send(new ResponseWrapper(
            movie, null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const updateMoviePoster: RequestHandler = async (req, res, next) => {
    try {
        if (req.file === null)
            throw Errors.MISSING_FILE

        const movie = await Movie.findOne({
            where: { id: req.params.id }
        })

        await movie.update({
            poster: req.file.filename
        })

        return res.send(new ResponseWrapper(
            "Poster changed", null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const deleteMovie: RequestHandler = async (req, res, next) => {
    try {
        const movieId = req.params.id

        if (!movieId)
            throw Errors.MISSING_ID

        await Promise.all([
            Movie.destroy({ where: { id: movieId } }),
            MovieActor.destroy({ where: { movieId: movieId } }),
            MovieGenre.destroy({ where: { movieId: movieId } }),
            MovieMedia.destroy({ where: { movieId: movieId } }),
            MovieScore.destroy({ where: { movieId: movieId } })
        ])

        return res.send(new ResponseWrapper(
            "Movie deleted", null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const searchMovie: RequestHandler = async (req, res, next) => {
    try {
        const q = req.query.q
        let limit: number = parseInt(req.query.limit as string) || 10
        let offset: number = parseInt(req.query.offset as string) || 0

        if (!q)
            throw Errors.BLANK

        const results: Movie[] = await sequelize.query(
            `SELECT * FROM movies WHERE title LIKE '%${q}%' LIMIT ${limit} OFFSET ${offset}`,
            { type: QueryTypes.SELECT }
        );

        results.forEach(movie => {
            movie.poster = Constants.ASSETS + 'posters/' + movie.poster
        })

        return res.send(new ResponseWrapper(
            results, null, paginate(results.length, limit, offset)
        ))

    } catch (error) {
        next(error)
    }
}

export const searchMovieByActor: RequestHandler = async (req, res, next) => {
    try {
        const actor = req.query.q
        let limit: number = parseInt(req.query.limit as string) || 10
        let offset: number = parseInt(req.query.offset as string) || 0

        if (!actor)
            throw Errors.BLANK

        const ids: Actor[] = await sequelize.query(
            `SELECT id FROM actors WHERE name LIKE '%${actor}%'`,
            { type: QueryTypes.SELECT }
        );

        const actorIds = ids.map(obj => obj.id)

        const movieIdsObj = await MovieActor.findAll({
            where: Sequelize.or(
                { actorId: actorIds }
            ),
            attributes: ['movieId']
        })

        const movieIds = movieIdsObj.map(obj => obj.movieId)

        const movies = await Movie.findAll({
            where: Sequelize.or({ id: movieIds }),
            limit: limit,
            offset: offset
        })

        return res.send(new ResponseWrapper(
            movies, null, paginate(movies.length, limit, offset)
        ))

    } catch (error) {
        next(error)
    }
}

export const addMedia: RequestHandler = async (req, res, next) => {
    try {
        const files = req.files as Array<any>
        const id = req.params.movieId

        const checkMovie = Movie.findOne({
            where: { id: id }
        })
        
        if(!checkMovie)
            throw Errors.NO_MOVIE

        const medias = files.map(file => {
            return {
                movieId: id,
                url: file.filename
            }
        })

        await MovieMedia.bulkCreate(medias)

        return res.send(new ResponseWrapper(
            "Inserted medias to movie", null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const getList: RequestHandler = async (req, res, next) => {
    try {
        let limit: number = parseInt(req.query.limit as string) || 10
        let offset: number = parseInt(req.query.offset as string) || 0
        let sortBy = parseInt(req.query.sortby as string) === 0 ? 'score' : 'views'

        const mostViewedList = await Movie.findAndCountAll({
            limit: limit,
            offset: offset,
            order: [[sortBy, 'DESC']]
        })

        return res.send(new ResponseWrapper(
            mostViewedList,
            null,
            paginate(mostViewedList.count, limit, offset)
        ))

    } catch (error) {
        next(error)
    }
}

export const addMovieGenre: RequestHandler = async (req, res, next) => {
    try {
        const data = {
            movieId: req.params.id,
            genreId: req.body.genreId
        }
        
        const addGenre: AddGenreToMovieDTO = plainToInstance(AddGenreToMovieDTO, data)
        await validateDTO(addGenre)

        const checkGenre = await MovieGenre.findOne({
            where: { movieId: data.movieId, genreId: data.genreId }
        })

        if (checkGenre)
            throw Errors.ALREADY_GENRED

        const addMovieGenre = await MovieGenre.create({
            movieId: data.movieId,
            genreId: data.genreId,
        })

        return res.send(new ResponseWrapper(
            addMovieGenre, null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const deleteMovieGenre: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        await MovieGenre.destroy({
            where: { id: id }
        })

        return res.send(new ResponseWrapper(
            "Genre removed from movie", null, null
        ))

    } catch (error) {
        next(error)
    }
}