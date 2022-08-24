import { Router } from "express";
import multer from "multer";
import { Constants } from "../config/constants";

const actorUpload = multer({ storage: Constants.ACTOR_STORAGE })

import { addActor, addRole, deleteRole, getActor, updateActor, updateActorPic } from "../controllers/actor.controller";
import { authorizeToken } from "../helpers/token";

const router = Router()

router.post('/add', authorizeToken, actorUpload.single('profilePic'), addActor)
router.patch('/update', authorizeToken, updateActor)
router.patch('/update-picture', authorizeToken, updateActorPic)
router.delete('/delete-role', authorizeToken, deleteRole),
router.post('add-role', authorizeToken, addRole)

router.get('/:id', getActor)

export default router