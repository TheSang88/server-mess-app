import express from 'express'
const router = express.Router();
import { login, register } from "../controllers/auth.controller.js"
import Joi from 'joi';
import {
    createValidator
} from 'express-joi-validation'
const validator = createValidator()

import requireAuth from "../middlewares/requireAuth.js";

const registerSchema = Joi.object({
    username: Joi.string().min(3).max(12).required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
});

const loginSchema = Joi.object({
    password: Joi.string().min(6).required(),
    email: Joi.string().email().required(),
});

router.post(
    "/register",
    validator.body(registerSchema),
    register
);


router.post(
    "/login",
    validator.body(loginSchema),
    login
);

router.get(
    "/me",
    requireAuth,
    (req, res) => {
        res.status(200).json({
            me: {
                _id: req.user.userId,
                email: req.user.email,
                username: req.user.username
            },
        });
    }
);

// test route for requireAuth middleware
router.get("/test", requireAuth, (req, res) => {
    res.send(`Hello, ${req.user.email}`);
});

export default router;
