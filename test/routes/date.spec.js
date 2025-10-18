import * as chai from 'chai'          // <-- namespace import (no default export in Chai v5)
import request from 'supertest'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'


import { app } from '../../src/server.js'
import { rateFetcher } from '../../src/services/RateService.js'


chai.use(sinonChai)
const { expect } = chai


describe('scenario - getByDate route', () => {
  let fetcherStub
  const rates = {
    DKK: {
      '2025-09-19': 1.5637
    },
    EUR: {
      '2025-09-19': 11.6705
    },
  }

  before(() => {
    fetcherStub = sinon.stub(rateFetcher, 'fetchByDate')
  })


  after(() => {
    sinon.restore()
  })

  it('average based on one observation', async function () {
    fetcherStub.resolves(rates)
    const exp = {
      DKK: {
        value: 1.5637,
          period: {
          start: '2025-09-19',
            end: '2025-09-19'
        },
        observations: 1
      },
      EUR: {
        value: 11.6705,
          period: {
          start: '2025-09-19',
            end: '2025-09-19'
        },
        observations: 1
      }
    }
    await request(app)
      .get('/api/v1/date/2025-09-19/DKK+EUR')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(exp)
      })

    expect(fetcherStub).to.have.been.calledWith(
        { date: '2025-09-19', currencies: ['DKK', 'EUR'] },
        1
      )
  })
})