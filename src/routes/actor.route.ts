import { Router } from "express";
import multer from "multer";
import { Constants } from "../config/constants";

const actorUpload = multer({ storage: Constants.ACTOR_STORAGE })

import { getActor } from "../controllers/actor.controller";
import { authorizeToken } from "../helpers/token";

const router = Router()

router.get('/details/:id', actorUpload.single('profilePic'), getActor)

export default router