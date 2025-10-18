/* global after, before */

import * as chai from 'chai'
import request from 'supertest'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

import { app } from '../../src/server.js'
import { rateFetcher } from '../../src/services/RateService.js'
import { calculateAverage } from '../utils/functions.js'

chai.use(sinonChai)
const { expect } = chai

describe('e2e - period', () => {
  let fetcherStub

  before(() => {
    fetcherStub = sinon.stub(rateFetcher, 'fetchByPeriod')
  })

  after(() => {
    sinon.restore()
  })

  afterEach(() => {
    fetcherStub.resetHistory()
    fetcherStub.resetBehavior()
  })

  it('average period: period/2025-02-20/2025-02-26/DKK+EUR', async function () {
    const rates = {
      DKK: {
        '2025-02-20': 1.5564,
        '2025-02-21': 1.5591,
        '2025-02-24': 1.5597,
        '2025-02-25': 1.5636,
        '2025-02-26': 1.5673
      },
      EUR: {
        '2025-02-20': 11.609,
        '2025-02-21': 11.629,
        '2025-02-24': 11.6355,
        '2025-02-25': 11.6638,
        '2025-02-26': 11.6895
      }
    }

    fetcherStub.resolves(rates)
    const exp = {
      DKK: {
        value: calculateAverage(Object.values(rates.DKK)),
        period: {
          start: '2025-02-20',
          end: '2025-02-26'
        },
        observations: 5
      },
      EUR: {
        value: calculateAverage(Object.values(rates.EUR)),
        period: {
          start: '2025-02-20',
          end: '2025-02-26'
        },
        observations: 5
      }
    }
    await request(app)
      .get('/api/v1/period/2025-02-20/2025-02-26/DKK+EUR')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(exp)
      })

    expect(fetcherStub).to.have.been.calledWith(
      { startDate: '2025-02-20', endDate: '2025-02-26', currencies: ['DKK', 'EUR'] }
    )
  })

  it('missing currencies: period/2025-02-20/2025-02-26 Not OK 404', async function () {
    await request(app)
      .get('/api/v1/period/2025-02-20/2025-02-26')
      .expect(404)

    expect(fetcherStub).to.not.have.been.called
  })

  it('mixed order of dates: period/2025-02-26/2025-02-20/DKK+EUR/ Not OK 400', async function () {
    const message = 'End date can not be before start date'

    const error = new Error(message)
    error.code = 400

    fetcherStub.rejects(error)

    const exp = {
      status_code: 400,
      message
    }

    await request(app)
      .get('/api/v1/period/2025-02-26/2025-02-20/DKK+EUR/')
      .expect(400)
      .expect(({ body }) => {
        expect(body).to.deep.equal(exp)
      })
  })
})
