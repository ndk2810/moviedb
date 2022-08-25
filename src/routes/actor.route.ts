import { Router } from "express";
import multer from "multer";
import { Constants } from "../config/constants";

const actorUpload = multer({ storage: Constants.ACTOR_STORAGE })

import { addActor, addRole, deleteRole, getActor, updateActor, updateActorPic } from "../controllers/actor.controller";
import { authorizeToken } from "../helpers/token";

const router = Router()

router.post('/add', actorUpload.single('profilePic'), addActor)
router.post('/:id/add-role', addRole)
router.delete('/:id/delete-role', deleteRole),
router.patch('/:id/update-picture', updateActorPic)
router.patch('/:id/update', updateActor)

router.get('/:id', getActor)

export default router