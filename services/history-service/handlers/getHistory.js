import middy from '@middy/core';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import httpErrorHandler from '@middy/http-error-handler';

import fetchAllSearchRecord from '../service/historyService.js';
import { successResponse } from 'libs/utils/response.js';

const baseHandler = async (event) => {
  try {
    const history = await fetchAllSearchRecord();
    return successResponse(history);
  } catch (err) {
    throw new Error('Failed to retrieve search history.');
  }
};

export const handler = middy(baseHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler());   
