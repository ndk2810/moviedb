import { Router } from "express";
import multer from "multer";
import { Constants } from "../config/constants";

const actorUpload = multer({ storage: Constants.ACTOR_STORAGE })

import { addActor, addRole, deleteRole, getActor, updateActor, updateActorPic } from "../controllers/actor.controller";
import { authorizeToken } from "../helpers/token";

const router = Router()

router.post('/add', authorizeToken, actorUpload.single('profilePic'), addActor)
router.patch('/update', authorizeToken, updateActor)
router.patch('/updatePic', authorizeToken, updateActorPic)
router.delete('/deleteRole', authorizeToken, deleteRole),
router.post('addRole', authorizeToken, addRole)
router.get('/details/:id', getActor)

export default router