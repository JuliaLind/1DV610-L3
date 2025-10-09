/**
 * Contains the main router.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import createError from 'http-errors'
import express from 'express'

export const router = express.Router()


router.get('/',
  (req, res) => {
    res.status(200).json({
      message: 'Welcome to the EXR API '
    })
  })

router.use((req, res, next) => {
  next(createError(404))
})