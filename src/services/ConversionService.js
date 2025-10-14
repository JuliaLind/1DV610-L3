import { CurrencyConverter } from '@jl225vf/exr'
import { stringToArray } from './lib/functions.js'

/**
 * Conversion service for converting amounts between currencies.
 */
export class ConversionService {
  /**
   * Converts a single amount between currencies based
   * on latest known exchange rates.
   *
   * @param {object} params - the request parameters
   * @param {number} params.amount - the amount to convert
   * @param {string} params.baseCurrency - the base currency
   * @param {string} params.targetCurrencies - the target currencies
   * @returns {Promise<object>} The conversion result.
   */
  async convertOne ({ amount, baseCurrency, targetCurrencies }) {
    const converter = new CurrencyConverter()

    converter.setBaseCurrency(baseCurrency)
    converter.setTargetCurrencies(stringToArray(targetCurrencies))

    return await converter.convert(amount)
  }
}
