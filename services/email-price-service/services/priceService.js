import axios from 'axios';
import logger from 'libs/logger/index.js';
import { ExternalAPIError } from 'libs/errors/customErrors.js';

export async function getCryptoPrice(symbol) {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${symbol}&vs_currencies=usd`;

    try {
        const response = await axios.get(url)

        if (!response.data?.[symbol]?.usd) {
            logger.error('API response does not contain expected data', {
                symbol,
                url,
                responseData: response.data
            })

            throw new ExternalAPIError(`Price data missing for symbol: ${symbol}`, {
                symbol,
                responseData: response.data
            })
        }

        return response.data[symbol].usd;
    } catch (err) {
        logger.error('Error fetching cryptocurrency price', {
            symbol,
            url,
            error: err.message,
            stack: err.stack
        })

        if (err instanceof ExternalAPIError) throw err;
        throw new ExternalAPIError(`Failed to fetch price for symbol: ${symbol}`, { cause: err, symbol });
    }
}
