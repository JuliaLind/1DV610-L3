/* global after, before */

import * as chai from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import { app } from '../../src/server.js'
import { converter } from '../../src/services/ConversionService.js'

chai.use(sinonChai)
const { expect } = chai

describe('e2e - convert', () => {
  let converterStub

  before(() => {
    converterStub = sinon.stub(converter, 'convert')
  })

  after(() => {
    sinon.restore()
  })

  afterEach(() => {
    converterStub.resetHistory()
    converterStub.resetBehavior()
  })

  it('Convert from SEK to PLN and EUR', async function () {
    const converted = {
      PLN: 134.78,
      EUR: 31.62

    }

    converterStub.resolves(converted)

    await request(app)
      .get('/api/v1/convert/350/SEK/PLN+EUR')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(converted)
      })

    expect(converterStub).to.have.been.calledWith(350)
  })
})
