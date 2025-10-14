/**
 * Contains the main router.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import createError from 'http-errors'
import express from 'express'

import { router as apiRouter } from './api/router.js'

export const router = express.Router()

router.use('/api', apiRouter)

router.get('/',
  (req, res) => {
    res.status(200).json({
      message: 'placeholder, serve index.html here',
    })
  })

router.use((req, res, next) => {
  next(createError(404))
})
