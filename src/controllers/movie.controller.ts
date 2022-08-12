import { RequestHandler } from "express"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { Movie } from "../models/movie/movie.model"

export const getMovie: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        const movie = await Movie.findOne({
            where: { id: id }
        })

        return res.send(new ResponseWrapper(
            movie, null, null
        ))

    } catch (error: any) {
        next(error)
    }
}