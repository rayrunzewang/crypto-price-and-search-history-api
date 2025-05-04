import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import logger from '../logger/index.js';
import { EmailSendError } from '../errors/customErrors.js';

const ses = new SESClient({ region: process.env.REGION_PARAM || 'ap-southeast-2' });

export async function sendEmail(to, symbol, price) {
  const subject = `Price of ${symbol.toUpperCase()}`;
  const bodyHtml = `
    <html>
      <body>
        <h3>Crypto Price Update</h3>
        <p>The current price of <strong>${symbol.toUpperCase()}</strong> is <strong>$${price}</strong>.</p>
      </body>
    </html>`;

  if (!process.env.SOURCE_EMAIL) {
    logger.error('SOURCE_EMAIL env variable missing');
    throw new EmailSendError('Source email not configured', { env: 'SOURCE_EMAIL' });
  }

  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: bodyHtml },
        Text: { Data: `The current price of ${symbol.toUpperCase()} is $${price}` },
      },
    },
    Source: process.env.SOURCE_EMAIL,
  };

  try {
    await ses.send(new SendEmailCommand(params));
    logger.info('Email sent successfully', { to, subject });
  } catch (error) {
    logger.error('Failed to send email via SES', { to, error: error.message });
    throw new EmailSendError('Failed to send email');
  }
}
