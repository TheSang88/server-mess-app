import express from 'express'
const router = express.Router();

import {
    createGroupChat,
    addMemberToGroup,
    leaveGroup,
    deleteGroup
} from "../controllers/groupChat.controller.js";

import Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'
const validator = createValidator()
import requireAuth from "../middlewares/requireAuth.js";

const createGroupChatSchema = Joi.object({
    name: Joi.string().required(),
});

const addMemberSchema = Joi.object({
    friendIds: Joi.array().min(1).items(Joi.string()),
    groupChatId: Joi.string().required(),
});

const leaveGroupSchema = Joi.object({
    groupChatId: Joi.string().required(),
});

const deleteGroupSchema = Joi.object({
    groupChatId: Joi.string().required(),
});

// create a groupChat
router.post(
    "/",
    requireAuth,
    validator.body(createGroupChatSchema),
    createGroupChat
);

// add a friend to the group
router.post(
    "/add",
    requireAuth,
    validator.body(addMemberSchema),
    addMemberToGroup
);

// leave a group
router.post(
    "/leave",
    requireAuth,
    validator.body(leaveGroupSchema),
    leaveGroup
);

// delete a group
router.post(
    "/delete",
    requireAuth,
    validator.body(deleteGroupSchema),
    deleteGroup
);


export default router;
