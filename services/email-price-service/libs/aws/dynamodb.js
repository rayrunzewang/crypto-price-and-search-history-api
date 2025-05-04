import { DynamoDBClient, PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import logger from '../../libs/logger/index.js';
import { DatabaseError } from '../errors/customErrors.js';

const db = new DynamoDBClient({});
const tableName = process.env.TABLE_NAME;

export async function saveSearch(data) {
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
  } catch (error) {
    logger.error('DynamoDB putItem failed', { error: error.message });
    throw new DatabaseError('Failed to save search record');
  }
}

export async function getSearchHistory() {
  try {
    const result = await db.send(new ScanCommand({ TableName: tableName }));
    return result.Items || [];
  } catch (error) {
    logger.error('DynamoDB scan failed', { error: error.message });
    throw new DatabaseError('Failed to retrieve search history');
  }
}
