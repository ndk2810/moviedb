import { plainToInstance } from "class-transformer"
import { RequestHandler } from "express"
import { Constants } from "../config/constants"
import { AddRoleDTO } from "../dtos/addrole.dto"
import { validateDTO } from "../dtos/validate"
import { Errors } from "../helpers/wrappers/errorWrapper"
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

        if (actor.profilePic)
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
        const id = req.params.id

        const actor = await Actor.findOne({
            where: { id: id }
        })

        if (!actor)
            throw Errors.NO_RESOURCE

        await actor.update({
            name: req.body.name,
            bio: req.body.bio,
            gender: req.body.gender
        })

        return res.send(new ResponseWrapper(
            id, null, null
        ))

    } catch (error: any) {
        next(error)
    }
}

export const updateActorPic: RequestHandler = async (req, res, next) => {
    try {
        if (req.file === null)
            throw Errors.MISSING_FILE

        const actor = await Actor.findOne({
            where: { id: req.params.id }
        })

        if (!actor)
            throw Errors.NO_RESOURCE

        await actor.update({
            profilePic: req.file.filename
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
        const movieRole = {
            movieId: req.body.movieId,
            actorId: req.params.id,
            role: req.body.role
        }

        const addRoleDTO: AddRoleDTO = plainToInstance(AddRoleDTO, movieRole)
        await validateDTO(addRoleDTO)

        const checkRole = await MovieActor.findOne({
            where: { movieId: movieRole.movieId, actorId: movieRole.actorId }
        })

        if (checkRole)
            throw "Actor/actress already appeared in movie as " + checkRole.role

        const addRole = await MovieActor.create({
            movieId: movieRole.movieId,
            actorId: movieRole.actorId,
            role: movieRole.role
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
        const id = req.params.id

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