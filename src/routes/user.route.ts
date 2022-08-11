import { Router } from "express";
const router = Router()

router.get('/', (req, res, next) => {
    res.send("Hello, this is user router")
})

export default router