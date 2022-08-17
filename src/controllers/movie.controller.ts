import { RequestHandler } from "express"
import { Constants } from "../config/constants"
import { sequelize } from "../config/database"
import { paginate } from "../helpers/wrappers/pagination"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { Movie } from "../models/movie/movie.model"
import { MovieActor } from "../models/movie/movieActor.model"
import { MovieGenre } from "../models/movie/movieGenre.model"
import { MovieMedia } from "../models/movie/movieMedia.model"
import { MovieScore } from "../models/movie/movieScore.model"

export const getMovie: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        const [movie, movieActors, movieMedias, movieGenres] = await Promise.all([
            Movie.findOne({ where: { id: id } }),
            MovieActor.findAll({ where: { movieId: id } }),
            MovieMedia.findAll({ where: { movieId: id } }),
            MovieGenre.findAll({ where: { movieId: id } })
        ])

        if (!movie)
            throw "Movie doesn't exist"

        movieMedias.forEach(media => {
            media.url = Constants.ASSETS + media.url
        })
        movie.poster = Constants.ASSETS + 'posters/' + movie.poster

        return res.send(new ResponseWrapper(
            { movie, movieActors, movieMedias, movieGenres }, null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const addMovie: RequestHandler = async (req, res, next) => {
    try {
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
        const movie = await Movie.findOne({
            where: { id: req.body.id }
        })

        await movie.update({
            title: req.body.title,
            overview: req.body.overview,
        })

        return res.send(new ResponseWrapper(
            "Movie info updated", null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const updateMoviePoster: RequestHandler = async (req, res, next) => {
    try {
        if(req.file === null)
            throw "No picture found"
            
        const movie = await Movie.findOne({
            where: { id: req.body.id }
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
        const movieId = req.body.id

        await Movie.destroy({ where: { id: movieId } })

        return res.send(new ResponseWrapper(
            "Movie deleted", null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const rateMovie: RequestHandler = async (req, res, next) => {
    try {
        const check = await MovieScore.findOne({
            where: { userId: req.body.userId, movieId: req.body.movieId }
        })

        if (check)
            throw "User already rated this movie"

        const rateMovie = await MovieScore.create({
            userId: req.body.userId,
            movieId: req.body.movieId,
            score: req.body.score
        })

        return res.send(new ResponseWrapper(
            rateMovie, null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const searchMovie: RequestHandler = async (req, res, next) => {
    try {
        const { q, category } = req.query
        let limit: number = parseInt(req.query.limit as string) || 10
        let offset: number = parseInt(req.query.offset as string) || 0

        const results = await sequelize.query(
            `SELECT * FROM movies WHERE title LIKE '%${q}%' LIMIT ${limit} OFFSET ${offset}`
        );

        return res.send(new ResponseWrapper(
            results, null, paginate(results[0].length, limit, offset)
        ))

    } catch (error) {
        next(error)
    }
}

export const addMedia: RequestHandler = async (req, res, next) => {
    try {
        if(!req.body.movieId)
            throw "Missing movie id"

        const files = req.files as Array<any>
        const id = req.body.movieId
        
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