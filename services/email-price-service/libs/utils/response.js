export function success(data = {}, message = 'Request successful', statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify({
      success: true,
      message,
      data,
    }),
  };
}
