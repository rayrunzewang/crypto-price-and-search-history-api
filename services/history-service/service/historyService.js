import { getAllSearchRecord } from 'libs/models/searchRecordModel.js';
import logger from 'libs/logger/index.js';
import { DatabaseError } from 'libs/errors/customErrors.js';

const fetchAllSearchRecord = async () => {
  try {
    const history = await getAllSearchRecord();

    if (!history || history.length === 0) {
      logger.info('No search history found');
      return [];
    }

    const filteredResult = history.map(item => ({
      email: item.email,
      symbol: item.symbol,
      timestamp: item.timestamp,
    }));

    return filteredResult;
  } catch (error) {
    logger.error('Error fetching search history', { error: error.message });
    throw new DatabaseError('Failed to fetch search history');
  }
};


export default fetchAllSearchRecord;
