import { CurrencyConverter, QuoteConverter } from "@jl225vf/exr"


export class ConversionService {
    async convertOne({ amount, baseCurrency, targetCurrencies}) {
        const converter = new CurrencyConverter()

        converter.setBaseCurrency(baseCurrency)
        converter.setTargetCurrencies(targetCurrencies?.split('+') || [])

        return await converter.convert(amount)
    }

    async convertMany({ observations, baseCurrency, targetCurrencies}) {
        const converter = new QuoteConverter()

        converter.setBaseCurrency(baseCurrency)
        converter.setTargetCurrencies(targetCurrencies?.split('+') || [])

        return await converter.convert(observations)
    
    }
}
