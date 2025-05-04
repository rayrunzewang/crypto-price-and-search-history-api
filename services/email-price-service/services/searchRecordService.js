import { saveSearchRecord } from 'libs/models/searchRecordModel.js';
import logger from 'libs/logger/index.js';
import { DatabaseError } from 'libs/errors/customErrors.js';

export async function saveSearch(data) {
  try {
    await saveSearchRecord(data);
    logger.info('Search saved', { symbol: data.symbol, email: data.email });
  } catch (error) {
    logger.error('Failed to save search record', { error: error.message });
    throw new DatabaseError('Failed to save search record');
  }
}

export async function getSearchHistory(email) {
  try {
    const records = await getSearchHistoryByEmail(email);

    if (!records.length) {
      logger.info('No search history found for user', { email });
    }

    return records;
  } catch (error) {
    logger.error('Failed to get search history', { error: error.message });
    throw new DatabaseError('Failed to retrieve search history');
  }
}
