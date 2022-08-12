import { RequestHandler } from "express"
import { signToken } from "../helpers/token"
import { encryptPassword, comparePassword } from "../helpers/password"
import { User } from "../models/user.model"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { validateDTO } from "../dtos/validate"
import { SignUpDTO } from "../dtos/signup.dto"
import { plainToInstance } from "class-transformer"
import { Queue, Worker } from 'bullmq'
import { Constants } from "../config/constants"
import { sendEmail } from "../helpers/email"

export const signUp: RequestHandler = async (req, res, next) => {
    try {
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

        const msg = {
            to: user.email,
            from: process.env.SENDGRID_EMAIL,
            subject: 'Sign up confirmation - TheMovieDB API',
            text: 'Click this link to confirm your email: http://localhost:3000/user/confirm?id=' + savedUser.id,
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

export const signIn: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findOne({
            where: {
                username: req.body.username
            }
        })

        if (!user)
            throw "Username doesn't exists"

        const checkPassword: boolean = await comparePassword(req.body.password, user.password)

        if (!checkPassword)
            throw "Incorrect password"

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
            throw "No account with that email found !"

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
        const user = await User.findOne({
            where: { id: req.body.id }
        })

        if (!user)
            throw "No account with that id found !"

        const newPassword = await encryptPassword(req.body.password)

        await user.update({ password: newPassword })

        return res.send(new ResponseWrapper(
            "Update successful", null, null
        ))

    } catch (error) {
        next(error)
    }
}