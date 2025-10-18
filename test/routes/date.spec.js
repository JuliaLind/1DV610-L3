import * as chai from 'chai'          // <-- namespace import (no default export in Chai v5)
import request from 'supertest'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'


import { app } from '../../src/server.js'
import { rateFetcher } from '../../src/services/RateService.js'


chai.use(sinonChai)
const { expect } = chai


describe('scenario - date', () => {
  let fetcherStub


  before(() => {
    fetcherStub = sinon.stub(rateFetcher, 'fetchByDate')
  })


  after(() => {
    sinon.restore()
  })

  afterEach(() => {
    fetcherStub.resetHistory()
    fetcherStub.resetBehavior()
  })


  it('average based on one observation: date/2025-09-19/DKK+EUR', async function () {
    const rates = {
      DKK: {
        '2025-09-19': 1.5637
      },
      EUR: {
        '2025-09-19': 11.6705
      },
    }

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

  it('average based on one observation: date/2025-02-26/DKK+EUR?observations=5', async function () {
    function calculateAverage(values) {
      const sum = values.reduce((acc, val) => acc + val, 0)
      return Number((sum / values.length).toFixed(4))
    }

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
      },
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
      .get('/api/v1/date/2025-02-26/DKK+EUR?observations=5')
      .expect(200)
      .expect('Content-Type', /json/)
      .expect(({ body }) => {
        expect(body).to.deep.equal(exp)
      })

    expect(fetcherStub).to.have.been.calledWith(
      { date: '2025-02-26', currencies: ['DKK', 'EUR'] },
      '5'
    )
  })
})