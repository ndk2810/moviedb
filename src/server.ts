import dotenv from 'dotenv'
dotenv.config()
import express, { Application } from 'express'
import { ExpressAdapter } from "@bull-board/express"
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api"
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter'
import { Constants } from './config/constants';
import path from 'path';
import router from './routes/index.route'
import { handler } from './helpers/wrappers/errorWrapper'
import { connect } from './config/database'

// Connect to database
connect()

// BullMQ and bull-board setup
const confirmMailQ = new Queue('confirm-mail', Constants.REDIS_CONNECTION)
const resetMailQ = new Queue('reset-mail', Constants.REDIS_CONNECTION)

const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: [new BullMQAdapter(confirmMailQ), new BullMQAdapter(resetMailQ)],
    serverAdapter: serverAdapter,
});

// App and middlewares
const app: Application = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/assets', express.static(path.join(__dirname, 'assets')))
app.use('/admin/queues', serverAdapter.getRouter());
app.use(router) // Route handler
app.use(handler) // Error handler

app.listen(process.env.PORT, () => {
    console.log("TheMovieDB API running on localhost:" + process.env.PORT)
})