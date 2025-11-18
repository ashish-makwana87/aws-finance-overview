
export function success(data) {

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}

export function error(message, code = 500) {

  return {
    statusCode: code,
    body: JSON.stringify({ error: message }),
  };
}

