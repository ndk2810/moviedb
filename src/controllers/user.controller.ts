import { RequestHandler } from "express"
import { signToken } from "../helpers/token"
import { encryptPassword, comparePassword } from "../helpers/password"
import { User } from "../models/user.model"
import { ResponseWrapper } from "../helpers/wrappers/responseWrapper"
import { validateDTO } from "../dtos/validate"
import { SignUpDTO } from "../dtos/signup.dto"
import { plainToInstance } from "class-transformer"
import sendgrid from '@sendgrid/mail'
import { Queue, Worker } from 'bullmq'
import { Constants } from "../config/constants"

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

        const myQueue = new Queue('confirm-mail', Constants.REDIS_CONNECTION);

        await myQueue.add('send-mail', await sendEmail(user.email, savedUser.id), {
            removeOnComplete: 500,
            removeOnFail: 500
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

// export const getAllUsers: RequestHandler = async (req, res, next) => {
//     try {
//         const lstUsers = await User.findAll()

//         return res.send(new ResponseWrapper(lstUsers, null, null))
//     } catch (error) {
//         next(error)
//     }
// }

const sendEmail = async (email: string, id: number) => {
    sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

    const msg = {
        to: email,
        from: process.env.SENDGRID_EMAIL,
        subject: 'Sign up confirmation - TheMovieDB API',
        text: 'Click this link to confirm your email: http://localhost:3000/user/confirm?id=' + id,
    }

    const result = await sendgrid.send(msg)

    return result
}