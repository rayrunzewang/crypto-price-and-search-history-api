import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../libs/logger/index.js';

const db = new DynamoDBClient({});
const tableName = process.env.TABLE_NAME;

export async function saveSearch(data) {
  const { symbol, email, timestamp } = data || {};
  if (!symbol || !email || !timestamp) {
    logger.warn('Missing required fields in saveSearch()', { data });
    throw new Error('Missing required search data');
  }

  const command = new PutItemCommand({
    TableName: tableName,
    Item: {
      id: { S: uuidv4() },
      symbol: { S: data.symbol },
      email: { S: data.email },
      timestamp: { N: String(data.timestamp) },
    },
  });

  try {
    await db.send(command);
    logger.info('Search saved', { symbol: data.symbol, email: data.email });
  } catch (err) {
    logger.error('Error saving search to DynamoDB', { error: err.message });
    throw err;
  }
}

export async function getSearchHistory() {
  const result = await db.send(new ScanCommand({ TableName: tableName }));
  return result.Items || [];
}
