/* global after, before */

import * as chai from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import { app } from '../../src/server.js'
import { rateFetcher } from '../../src/services/RateService.js'

chai.use(sinonChai)
const { expect } = chai

describe('e2e - currencies route', () => {
  const currencies = [
    { id: 'AUD', name: 'Australian dollar' },
    { id: 'BDT', name: 'Bangladeshi taka' },
    { id: 'BGN', name: 'Bulgarian lev' },
    { id: 'DKK', name: 'Danish krone' },
    { id: 'EUR', name: 'Euro' }

  ]

  before(() => {
    sinon.stub(rateFetcher, 'getAvailableCurrencies').resolves(currencies)
  })

  after(() => {
    sinon.restore()
  })

  it('should return list of currencies', async function () {
    await request(app)
      .get('/api/v1/currencies')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(currencies)
      })
  })
})
