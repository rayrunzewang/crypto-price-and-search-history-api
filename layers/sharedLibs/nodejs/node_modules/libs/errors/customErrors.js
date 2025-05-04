export class CustomError extends Error {
  constructor(message, statusCode = 400, code = 'CUSTOM_ERROR', meta = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.meta = meta;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends CustomError {
  constructor(message = 'Bad Request', meta = {}) {
    super(message, 400, 'BAD_REQUEST', meta);
  }
}

export class ValidationError extends CustomError {
  constructor(message = 'Validation failed', meta = {}) {
    super(message, 422, 'VALIDATION_FAILED', meta);
  }
}

export class EmailSendError extends CustomError {
  constructor(message = 'Failed to send email', meta = {}) {
    super(message, 502, 'EMAIL_SEND_ERROR', meta);
  }
}

export class DatabaseError extends CustomError {
  constructor(message = 'Database operation failed', meta = {}) {
    super(message, 503, 'DATABASE_ERROR', meta);
  }
}

export class ExternalAPIError extends CustomError {
  constructor(message = 'Failed to fetch external data', meta = {}) {
    super(message, 502, 'EXTERNAL_API_ERROR', meta);
  }
}

export class RateLimitError extends CustomError {
  constructor(message = 'Rate limit exceeded', meta = {}) {
    super(message, 429, 'RATE_LIMIT_EXCEEDED', meta);
  }
}

export class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized', meta = {}) {
    super(message, 401, 'UNAUTHORIZED', meta);
  }
}

export class NotFoundError extends CustomError {
  constructor(message = 'Resource not found', meta = {}) {
    super(message, 404, 'NOT_FOUND', meta);
  }
}
