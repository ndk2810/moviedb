import express, { Application, Request, NextFunction, Response } from 'express'
import dotenv from 'dotenv'
dotenv.config()
import { ResponseWrapper } from './helpers/wrappers/responseWrapper'
import { ExpressAdapter } from "@bull-board/express"
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { Constants } from './config/constants';
import path from 'path';

// BullMQ and bull-board setup
const confirmMailQ = new Queue('confirm-mail', Constants.REDIS_CONNECTION)
const resetMailQ = new Queue('reset-mail', Constants.REDIS_CONNECTION)

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(confirmMailQ), new BullMQAdapter(resetMailQ)],
    serverAdapter: serverAdapter,
});

const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
app.use('/assets', express.static(path.join(__dirname, 'assets')))

app.use('/admin/queues', serverAdapter.getRouter());

import { connect } from './config/database'
connect()

//  Route handler
import router from './routes/index.route'
import { ErrorWrapper } from './helpers/wrappers/errorWrapper'
app.use(router)

//  Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        if (err instanceof ErrorWrapper) {
            return res.status(err.code).send(new ResponseWrapper(
                null, err, null
            ))
        }
        return res.status(500).send(new ResponseWrapper(
            null, {
                message: err.message || err,
                code: 500,
                status: "err.unhandledException"
            }, null
        ))
    }
})

app.listen(process.env.PORT, () => {
    console.log("TheMovieDB API running on localhost:" + process.env.PORT)
})