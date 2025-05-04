import middy from '@middy/core'
import httpJsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'

import { getCryptoPrice } from '../service/priceService.js'
import { saveSearch } from '../libs/aws/dynamodb.js'
import { sendEmail } from '../libs/aws/ses.js';
import { success } from '../libs/utils/response.js'
import { errorFormatter } from '../libs/middlewares/errorHandler.js'
import { BadRequestError } from '../libs/errors/customErrors.js'
import { isValidEmail, isValidSymbol } from '../libs/utils/validators.js';


const baseHandler = async (event) => {
  const { symbol, email } = event.body;

  if (!symbol || !email) {
    throw new BadRequestError('Missing symbol or email');
  }

  if (!isValidSymbol(symbol)) {
    throw new BadRequestError('Invalid symbol format');
  }

  if (!isValidEmail(email)) {
    throw new BadRequestError('Invalid email format');
  }

  const price = await getCryptoPrice(symbol);
  await sendEmail(email, symbol, price);
  await saveSearch({ symbol, email, timestamp: Date.now() });

  return success(
    {},
    `Email sent to ${email} successfully with current price of ${symbol.toUpperCase()}. If you did not receive the email, please check spam box.`
  );

};

export const handler = middy(baseHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(errorFormatter())
