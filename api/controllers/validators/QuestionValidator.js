import { check } from 'express-validator'

export const textValidator = [
  check('text').exists({ checkFalsy: true }).isString().isLength({ min: 1 }).trim().escape()
]

export const banValidator = [
  check('justification').exists({ checkFalsy: true }).isString().isLength({ min: 1 }).trim().escape()
]