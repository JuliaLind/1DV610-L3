import { expect } from 'chai'
import { CurrencyCalculator } from '../../public/js/services/CurrencyCalculator.js'

describe('CurrencyCalculator', () => {
  const rates = {
    USD: 1.0, EUR: 0.9, GBP: 0.8

  }

  it('Get/set amount OK', () => {
    const calculator = new CurrencyCalculator()

    calculator.setAmount(100)
    expect(calculator.getAmount()).to.equal(100)
  })

  describe('Get/set base currency', () => {

    it('not previously set OK', () => {
      const calculator = new CurrencyCalculator()
      calculator.setBaseCurrency('USD')
      expect(calculator.getBaseCurrency()).to.equal('USD')
    })

    it('previously set, changed OK', () => {
      const calculator = new CurrencyCalculator()

      calculator.setBaseCurrency('USD')
      calculator.setRates(rates)

      expect(calculator.hasCachedRates()).to.be.true

      calculator.setBaseCurrency('EUR')
      expect(calculator.getBaseCurrency()).to.equal('EUR')
      expect(calculator.hasCachedRates()).to.be.false
    })

    it('previously set, not changed OK', () => {
      const calculator = new CurrencyCalculator()

      calculator.setBaseCurrency('EUR')
      calculator.setRates(rates)

      calculator.setBaseCurrency('EUR')
      expect(calculator.getBaseCurrency()).to.equal('EUR')
      expect(calculator.hasCachedRates()).to.be.true
    })
  })

  describe('Get/set target currencies', () => {
    it('not previously set OK', () => {
      const calculator = new CurrencyCalculator()
      calculator.setTargetCurrencies(['USD', 'EUR'])
      expect(calculator.getTargetCurrencies()).to.deep.equal(['USD', 'EUR'])
    })

    it('previously set, changed OK', () => {
      const calculator = new CurrencyCalculator()

      calculator.setTargetCurrencies(['USD', 'EUR'])
      calculator.setRates(rates)

      expect(calculator.hasCachedRates()).to.be.true

      calculator.setTargetCurrencies(['USD', 'EUR', 'PLN'])
      expect(calculator.getTargetCurrencies()).to.deep.equal(['USD', 'EUR', 'PLN'])
      expect(calculator.hasCachedRates()).to.be.false
    })

    it('previously set, not changed OK', () => {
      const calculator = new CurrencyCalculator()

      calculator.setTargetCurrencies(['USD', 'EUR'])
      calculator.setRates(rates)

      calculator.setTargetCurrencies(['EUR', 'USD'])
      expect(calculator.getTargetCurrencies()).to.deep.equal(['EUR', 'USD'])
      expect(calculator.hasCachedRates()).to.be.true
    })
  })
})
