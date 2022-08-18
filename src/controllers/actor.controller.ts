import { RequestHandler } from "express"
import { Constants } from "../config/constants"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { Actor } from "../models/actor.model"
import { MovieActor } from "../models/movie/movieActor.model"

export const getActor: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        const [actor, listMovies] = await Promise.all([
            Actor.findOne({ where: { id: id } }),
            MovieActor.findAll({ where: { actorId: id } })
        ])

        if(actor.profilePic)
            actor.profilePic = Constants.ASSETS + 'actors/' + actor.profilePic

        return res.send(new ResponseWrapper(
            { actor, listMovies },
            null,
            null
        ))

    } catch (error: any) {
        next(error)
    }
}

export const addActor: RequestHandler = async (req, res, next) => {
    try {
        const actor = await Actor.create({
            name: req.body.name,
            bio: req.body.bio,
            gender: req.body.gender,
            profilePic: req.file.filename
        })

        return res.send(new ResponseWrapper(
            actor, null, null
        ))

    } catch (error: any) {
        next(error)
    }
}

export const updateActor: RequestHandler = async (req, res, next) => {
    try {
        const actor = await Actor.findOne({
            where: { id: req.body.id }
        })

        await actor.update({
            name: req.body.name,
            bio: req.body.bio,
            gender: req.body.gender
        })

        return res.send(new ResponseWrapper(
            actor, null, null
        ))

    } catch (error: any) {
        next(error)
    }
}

export const updateActorPic: RequestHandler = async (req, res, next) => {
    try {
        if (req.file === null)
            throw "No picture found"

        const actor = await Actor.findOne({
            where: { id: req.body.id }
        })

        await actor.update({
            poster: req.file.filename
        })

        return res.send(new ResponseWrapper(
            "Profile picture changed", null, null
        ))
    } catch (error) {
        next(error)
    }
}

export const addRole: RequestHandler = async (req, res, next) => {
    try {
        const { movieId, actorId, role } = req.body
        const checkRole = await MovieActor.findOne({
            where: { movieId: movieId, actorId: actorId }
        })

        if (checkRole)
            throw "Actor/actress already appeared in movie as " + checkRole.role

        const addRole = await MovieActor.create({
            movieId: movieId,
            actorId: actorId,
            role: role
        })

        return res.send(new ResponseWrapper(
            addRole, null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const deleteRole: RequestHandler = async (req, res, next) => {
    try {
        const id = req.body.id

        await MovieActor.destroy({
            where: { id: id }
        })

        return res.send(new ResponseWrapper(
            "Role deleted", null, null
        ))

    } catch (error) {
        next(error)
    }
}