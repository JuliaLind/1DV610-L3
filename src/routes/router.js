/**
 * Contains the main router.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import createError from 'http-errors'
import express from 'express'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { router as apiRouter } from './api/router.js'


export const router = express.Router()


router.use('/api', apiRouter)

const directoryOfFile = dirname(fileURLToPath(import.meta.url))

router.use(express.static(join(directoryOfFile, '../../public')))

router.get('/', (req, res) => {
  res.sendFile(join(directoryOfFile, '../../public/index.html'))
})


router.use((req, res, next) => {
  next(createError(404))
})
