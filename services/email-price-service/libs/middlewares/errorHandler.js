import logger from '../logger/index.js'

export const errorFormatter = () => ({
  onError: async (request) => {
    const { error } = request

    const statusCode = error.statusCode || 500
    const message = error.message || 'Something went wrong'

    logger.error(error)

    request.response = {
      statusCode,
      body: JSON.stringify({
        success: false,
        message
      })
    }
  }
})
