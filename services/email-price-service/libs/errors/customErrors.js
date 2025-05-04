export class CustomError extends Error {
  constructor(message, statusCode = 400, code = 'CUSTOM_ERROR', meta = {}) {
    super(message)
    this.name = this.constructor.name
    this.statusCode = statusCode
    this.code = code
    this.meta = meta
    Error.captureStackTrace(this, this.constructor)
  }
}

export class BadRequestError extends CustomError {
  constructor(message, meta = {}) {
    super(message, 400, 'BAD_REQUEST', meta)
  }
}

export class ValidationError extends CustomError {
  constructor(message, meta = {}) {
    super(message, 422, 'VALIDATION_FAILED', meta)
  }
}

export class ExternalAPIError extends CustomError {
  constructor(message, meta = {}) {
    super(message, 502, 'EXTERNAL_API_ERROR', meta)
  }
}
