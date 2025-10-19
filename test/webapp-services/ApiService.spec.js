/* global before after */

import { expect, use } from 'chai'
import { ApiService } from '../../public/js/services/ApiService.js'

import sinon from 'sinon'
import sinonChai from 'sinon-chai'

use(sinonChai)

describe('ApiService', () => {
  let fetchStub

  before(() => {
    fetchStub = sinon.stub(globalThis, 'fetch')
  })

  afterEach(() => {
    fetchStub.resetHistory()
    fetchStub.resetBehavior()
  })

  after(() => {
    fetchStub.restore()
  })

  it('fetchCurrencies() OK', async () => {
    const currencies = [
      { id: 'AUD', name: 'Australian dollar' },
      { id: 'BDT', name: 'Bangladeshi taka' },
      { id: 'BGN', name: 'Bulgarian lev' },
      { id: 'CHF', name: 'Swiss franc' }
    ]
    fetchStub.resolves({
      ok: true,
      /**
       * Mocked fetch response.
       *
       * @returns {Promise<object>} - promise containing the fake data object
       */
      json: () => Promise.resolve(currencies)
    })

    const sut = new ApiService('http://example.com/')
    const result = await sut.fetchCurrencies()
    expect(result).to.deep.equal(currencies)
    expect(fetchStub).to.have.been.calledOnceWithExactly('http://example.com/api/v1/currencies')
  })
})