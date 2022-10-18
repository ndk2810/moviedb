import jwt, { JwtPayload } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import redis from 'redis'
import { Errors } from './wrappers/errorWrapper'
import { Constants } from '../config/constants'

const redisClient = redis.createClient()
redisClient.connect()

export interface IJwtPayload extends JwtPayload {
    _id: string
}

export const signToken = (userID: string): string => {
    const token = jwt.sign({ _id: userID }, process.env.ACCESS_TOKEN_SECRET)

    redisClient.setEx(`token:${userID}`, 60 * 60, token)

    return token
}

export const authorizeToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization
        const token = authHeader && authHeader.split(' ')[1]

        if (!token)
            throw Errors.MISSING_TOKEN

        const payload: IJwtPayload =
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as IJwtPayload

        if (await redisClient.exists(`token:${payload._id}`) === 0) {
            throw Errors.TOKEN_EXPIRED
        }

        next()

    } catch (error: any) {
        next(error)
    }
}