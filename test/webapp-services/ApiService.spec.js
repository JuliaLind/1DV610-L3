/* global before after */

import { expect, use } from 'chai'
import { ApiService } from '../../public/js/services/ApiService.js'

import sinon from 'sinon'
import sinonChai from 'sinon-chai'
import chaiAsPromised from 'chai-as-promised'

use(sinonChai)
use(chaiAsPromised)

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

  describe('fetchCurrencies)', () => {
    it(' OK', async () => {
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

    it('Not OK, API reutrns status 500', async () => {
      fetchStub.resolves({
        ok: false,
        /**
         * Mocked fetch response.
         *
         * @returns {Promise<object>} - promise containing the fake data object
         */
        json: () => Promise.resolve({
          message: 'Internal server error.',
          status_code: 500
        })
      })

      const sut = new ApiService('http://example.com/')
      expect(sut.fetchCurrencies()).to.be.rejectedWith('Internal server error.')
    })
  })

  describe('submitConversion)', () => {
    it('submitConversion() OK', async () => {
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

    it('submitConversion() Not OK', async () => {
      fetchStub.resolves({
        ok: false,
        /**
         * Mocked fetch response.
         *
         * @returns {Promise<object>} - promise containing the fake data object
         */
        json: () => Promise.resolve({
          message: 'Internal server error.',
          status_code: 500
        })
      })

      const sut = new ApiService('http://example.com/')
      expect(sut.fetchCurrencies()).to.be.rejectedWith('Internal server error.')
    })
  })
})
