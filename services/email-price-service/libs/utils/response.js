export function success(data, statusCode = 200) {
  return {
    statusCode,
    body: JSON.stringify({ success: true, data }),
  };
}
