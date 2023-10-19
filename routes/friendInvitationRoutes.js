import express from 'express'
const router = express.Router();

import { inviteFriend, acceptInvitation, rejectInvitation, removeFriend } from "../controllers/friendInvitation.controller.js";

import Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'
const validator = createValidator()
import requireAuth from "../middlewares/requireAuth.js";

const invitationSchema = Joi.object({
    email: Joi.string().email().required(),
});


const approveInvitationSchema = Joi.object({
    invitationId: Joi.string().required(),
});

const removeFriendSchema = Joi.object({
    friendId: Joi.string().required(),
});


// invite a friend
router.post("/invite", requireAuth, validator.body(invitationSchema), inviteFriend);

// accept a friend invitation
router.post("/accept", requireAuth, validator.body(approveInvitationSchema), acceptInvitation);

// reject a friend invitation
router.post("/reject", requireAuth, validator.body(approveInvitationSchema), rejectInvitation);

// remove a friend
router.post("/remove", requireAuth, validator.body(removeFriendSchema), removeFriend);

export default router;
