import fetchAllSearchRecord from '../service/historyService.js';

export const handler = async (event) => {
  try {
    const history = await fetchAllSearchRecord();
    return {
      statusCode: 200,
      body: JSON.stringify(history),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      body: 'Failed to retrieve history.',
    };
  }
};
