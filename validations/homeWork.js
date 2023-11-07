import { body } from "express-validator";

export const HomeWorkValidator = [
    body('title').isLength({min: 5}),
    body('info').isLength({min: 10}),
    body('group').isLength({min: 3}),
    body('lesson').isLength({min: 3})
];