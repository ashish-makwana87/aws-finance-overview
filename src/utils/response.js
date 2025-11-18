export function success(data) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function error(message, code = 500) {
  return {
    statusCode: code,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: message }),
  };
}
