import { RequestHandler } from "express"
import { IJwtPayload, signToken } from "../helpers/token"
import jwt from 'jsonwebtoken'
import { encryptPassword, comparePassword } from "../helpers/password"
import { User } from "../models/user.model"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { validateDTO } from "../dtos/validate"
import { SignUpDTO } from "../dtos/signup.dto"
import { plainToInstance } from "class-transformer"
import { Queue, Worker } from 'bullmq'
import { Constants } from "../config/constants"
import { sendEmail } from "../helpers/email"
import { MovieScore } from "../models/movie/movieScore.model"
import { Errors } from "../helpers/wrappers/errorWrapper"

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        if (!req.body.email || !req.body.username || !req.body.password)
            throw Errors.MISSING_PROPERTIES

        const data = {
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        }

        const signUpDTO: SignUpDTO = plainToInstance(SignUpDTO, data)
        await validateDTO(signUpDTO)

        const user = new User(data)

        user.password = await encryptPassword(user.password)
        const savedUser = await user.save()

        const confirmMailQ = new Queue('confirm-mail', Constants.REDIS_CONNECTION);
        const confirmToken = jwt.sign({ _id: savedUser.id.toString() }, process.env.ACCESS_TOKEN_SECRET)

        const msg = {
            to: user.email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Sign up confirmation - TheMovieDB API',
            text: 'Click this link to confirm your email: http://localhost:3000/user/confirm?id=' + confirmToken,
        }

        await confirmMailQ.add('send-mail', await sendEmail(msg), {
            removeOnComplete: 200,
            removeOnFail: 200
        })

        const worker = new Worker("confirm-mail", async job => { }, Constants.REDIS_CONNECTION);

        return res.send(new ResponseWrapper(
            savedUser,
            null,
            null
        ))

    } catch (error: any) {
        next(error)
    }
}

export const confirmAccount: RequestHandler = async (req, res, next) => {
    const token = req.query.id as string

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as IJwtPayload

    const user = await User.findOne({
        where: { id: payload._id }
    })

    if(!user)
        throw Errors.NO_ACCOUNT

    await user.update({
        confirmed: 1
    })

    return res.send(new ResponseWrapper(
        "Account confirmed", null, null
    ))
}

export const signIn: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        })

        if (!user)
            throw Errors.NO_ACCOUNT

        const checkPassword: boolean = await comparePassword(req.body.password, user.password)

        if (!checkPassword)
            throw Errors.WRONG_PASSWORD

        const token: string = signToken(user.id.toString())

        return res.send(new ResponseWrapper(token, null, null))

    } catch (error: any) {
        next(error)
    }
}

export const forgotPassword: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: { email: req.body.email }
        })

        if (!user)
            throw Errors.NO_ACCOUNT

        const resetMailQ = new Queue('reset-mail', Constants.REDIS_CONNECTION);

        const msg = {
            to: user.email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Reset password - TheMovieDB API',
            text: 'Click this link to reset your password: <link to front end page to reset password here ?>',
        }

        await resetMailQ.add('send-mail', await sendEmail(msg), {
            removeOnComplete: 200,
            removeOnFail: 200
        })

        const worker = new Worker('reset-mail', async job => { }, Constants.REDIS_CONNECTION)

        return res.send(new ResponseWrapper(
            "Reset email sent", null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const resetPassword: RequestHandler = async (req, res, next) => {
    try {
        if(!req.body.password || req.body.id)
            throw Errors.MISSING_PROPERTIES

        const user = await User.findOne({
            where: { id: req.body.id }
        })

        if (!user)
            throw Errors.NO_ACCOUNT

        const newPassword = await encryptPassword(req.body.password)

        await user.update({ password: newPassword })

        return res.send(new ResponseWrapper(
            "Password updated", null, null
        ))

    } catch (error) {
        next(error)
    }
}

export const rateMovie: RequestHandler = async (req, res, next) => {
    try {
        if (!req.body.userId || !req.body.movieId)
            throw Errors.MISSING_ID

        const check = await MovieScore.findOne({
            where: { userId: req.body.userId, movieId: req.body.movieId }
        })

        if (check)
            throw Errors.ALREADY_RATED

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


export const deleteRating: RequestHandler = async (req, res, next) => {
    try {
        const check = await MovieScore.findOne({
            where: { userId: req.body.userId, movieId: req.body.movieId }
        })

        if (!check)
            throw Errors.NO_RESOURCE

        await check.destroy()

        return res.send(new ResponseWrapper(
            "Rating deleted", null, null
        ))
    } catch (error) {
        next(error)
    }
}