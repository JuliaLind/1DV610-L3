/**
 * Contains the v1 api router.
 *
 * @author Julia Lind
 * @version 1.0.0
 */
import express from 'express'
import { ApiController } from '../../../controllers/ApiController.js'

export const router = express.Router()
const apiController = new ApiController()

router.get('/date/:date/:currencies', apiController.getByDate)

router.get('/period/:startDate/:endDate/:currencies', apiController.getByPeriod)

router.get('/latest/:currencies', apiController.getLatest)

router.get('/currencies', apiController.getCurrencies)

router.get('/convert/:amount/:baseCurrency/:targetCurrencies', apiController.convertOne)
