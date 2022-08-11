import express, { Application, Request, NextFunction, Response } from 'express'
import dotenv from 'dotenv'
import { ResponseWrapper } from './helpers/responseWrapper'

dotenv.config()
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

import { connect } from './config/database'
connect()

//  Route handler
import router from './routes/index'
app.use(router)

//  Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.json(new ResponseWrapper(
            null,
            {
                status: res.locals.status ? res.locals.status : "err.unhandledException",
                code: 500,
                message: err
            },
            null
        ))
    }
})

app.listen(process.env.PORT, () => {
    console.log("TheMovieDB API running on localhost:" + process.env.PORT)
})