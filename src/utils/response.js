export function success(data) {
  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  };
}

export function errorHandler(err) {
 
  const status = err.statusCode || 500; 
  const errorMessage = err.message || "Something went wrong";

  return {
    statusCode: status,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: errorMessage}),
  };
}
