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

  describe('Get/set target currencies', () => {
    it('not previously set OK', () => {
      const calculator = new CurrencyCalculator()
      calculator.setTargetCurrencies(['USD', 'EUR'])
      expect(calculator.getTargetCurrencies()).to.deep.equal(['USD', 'EUR'])
    })

    it('previously set, changed OK', () => {
      const calculator = new CurrencyCalculator()

      calculator.setTargetCurrencies(['USD', 'EUR', 'HUF'])
      calculator.setRates(rates)

      expect(calculator.hasCachedRates()).to.be.true

      calculator.setTargetCurrencies(['USD', 'EUR', 'PLN'])
      expect(calculator.getTargetCurrencies()).to.deep.equal(['USD', 'EUR', 'PLN'])
      expect(calculator.hasCachedRates()).to.be.false
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

  it('setRates ok', () => {
    const calculator = new CurrencyCalculator()
    calculator.setAmount(1)
    calculator.setBaseCurrency('DKK')
    calculator.setTargetCurrencies(['EUR', 'GBP', 'USD'])
    calculator.setRates(rates)
    const values = calculator.getValues()
    expect(values).to.deep.equal(rates)
  })

  describe('getValues', () => {
    it('with no rates throws error', () => {
      const calculator = new CurrencyCalculator()
      calculator.setAmount(1)
      calculator.setBaseCurrency('DKK')
      calculator.setTargetCurrencies(['EUR', 'GBP', 'USD'])
      expect(() => calculator.getValues()).to.throw('Rates have not been set.')
    })

    it('with missing amount throws error', () => {
      const calculator = new CurrencyCalculator()
      calculator.setBaseCurrency('DKK')
      calculator.setTargetCurrencies(['EUR', 'GBP', 'USD'])
      calculator.setRates(rates)
      expect(() => calculator.getValues()).to.throw('Invalid amount.')
    })

    it('with NaN amount throws error', () => {
      const calculator = new CurrencyCalculator()
      calculator.setAmount('not a number')
      calculator.setBaseCurrency('DKK')
      calculator.setTargetCurrencies(['EUR', 'GBP', 'USD'])
      calculator.setRates(rates)
      expect(() => calculator.getValues()).to.throw('Invalid amount.')
    })

    it('with all data set OK', () => {
      const calculator = new CurrencyCalculator()
      calculator.setAmount(100)
      calculator.setBaseCurrency('DKK')
      calculator.setTargetCurrencies(['EUR', 'GBP', 'USD'])
      calculator.setRates(rates)
      const values = calculator.getValues()
      expect(values).to.deep.equal({
        USD: 100, EUR: 90, GBP: 80
      })
    })
  })

  it('hasFreshRates not ok', () => {
    const calculator = new CurrencyCalculator()
    calculator.setRates(rates)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    expect(calculator.hasFreshRates(yesterday)).to.be.false
  })

  it('getDate ok', () => {
    const calculator = new CurrencyCalculator()
    calculator.setRates(rates)
    const today = new Date()
    const dateStr = today.toISOString().split('T')[0]
    expect(calculator.getDate()).to.equal(dateStr)
  })
})