import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'

import { getCryptoPrice } from '../service/priceService.js'
import { success } from '../libs/utils/response.js'
import { errorFormatter } from '../libs/middlewares/errorHandler.js'
import { BadRequestError } from '../libs/errors/customErrors.js'


const baseHandler = async (event) => {
  const { symbol, email } = event.body

  if (!symbol || !email) {
    throw new BadRequestError('Missing symbol or email')
  }

  const price = await getCryptoPrice(symbol)

  return success({ symbol, price });
}

export const handler = middy(baseHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(errorFormatter())
