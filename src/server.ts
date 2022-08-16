import express, { Application, Request, NextFunction, Response } from 'express'
import dotenv from 'dotenv'
import { ResponseWrapper } from './helpers/wrappers/responseWrapper'
import { ExpressAdapter } from "@bull-board/express"
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { Constants } from './config/constants';

dotenv.config()

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
app.use('/admin/queues', serverAdapter.getRouter());

import { connect } from './config/database'
connect()

//  Route handler
import router from './routes/index.route'
app.use(router)

//  Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        return res.status(500).send(new ResponseWrapper(
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