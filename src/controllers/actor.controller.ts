import { RequestHandler } from "express"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { Actor } from "../models/actor.model"

export const getActor: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id

        const actor = Actor.findOne({
            where: { id: id }
        })

        return res.send(new ResponseWrapper(
            actor,
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