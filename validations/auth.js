import { body } from "express-validator"

export const registerValidation = [
    body('email').isEmail(),
    body('password').isLength({min: 5}),
    body('passwordRepeat').isLength({min: 0}),
    body('name').isLength({min: 3}),
    body('lastName').isLength({min: 3}),
    body('group').isLength({min: 3}),
];