import { RequestHandler } from "express"
import { paginate } from "../helpers/wrappers/pagination"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { Movie } from "../models/movie/movie.model"
import { MovieActor } from "../models/movie/movieActor.model"
import { MovieMedia } from "../models/movie/movieMedia.model"

export const getMovie: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        const [movie, movieActors, movieMedias] = await Promise.all([
            Movie.findOne({ where: { id: id } }),
            MovieActor.findAll({ where: { movieId: id } }),
            MovieMedia.findAll({ where: { movieId: id } }),
        ])

        return res.send(new ResponseWrapper(
            { movie, movieActors, movieMedias }, null, null
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
            poster: req.body.poster || "joker.jpg",
        })

        let movieActors

        if (req.body.movieactors) {
            // const arr: any = req.body.movieactors

            const cast = req.body.movieactors.map((movieActor: { actorId: number; role: string }) => {
                return {
                    movieId: movie.id,
                    actorId: movieActor.actorId,
                    role: movieActor.role
                }
            })

            movieActors = await MovieActor.bulkCreate(cast)
        }

        return res.send(new ResponseWrapper(
            { movie, movieActors }, null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const updateMovie: RequestHandler = async (req, res, next) => {
    try {
        const movieId = req.body.id

        const updatedMovie = Movie.update(
            { 
                title: req.body.title,
                overview: req.body.overview,
                poster: req.body.poster
            },
            { where: { id: movieId } })

        return res.send(new ResponseWrapper(
            updatedMovie, null, null
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