import { Router } from "express";
import multer from "multer";
import { Constants } from "../config/constants";

const actorUpload = multer({ storage: Constants.ACTOR_STORAGE })

import { addActor, addRole, deleteRole, getActor, updateActor, updateActorPic } from "../controllers/actor.controller";
import { authorizeToken } from "../helpers/token";

const router = Router()

router.post('/add', actorUpload.single('profilePic'), addActor)
router.patch('/update', updateActor)
router.patch('/updatePic', updateActorPic)
router.delete('/deleteRole', deleteRole),
router.post('addRole', addRole)
router.get('/details/:id', getActor)

export default router