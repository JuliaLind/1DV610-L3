/**
 * Contains the API router.
 *
 * @author Julia Lind
 * @version 1.0.0
 */

import express from 'express'
import { router as v1Router } from './v1/router.js'

export const router = express.Router()

router.use('/v1', v1Router)

// router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

router.get('/',
  (req, res) => {
    res.status(200).json({
      message: 'Welcome to the API',
      documentation: '/api/swagger/'
    })
  })




