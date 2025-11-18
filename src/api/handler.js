import { authRoutes } from "./routes/auth.routes.js";

export const handler = async (event) => {
  const path = event.requestContext.http.path;
  const httpMethod = event.requestContext.http.method;

  const route = authRoutes[path]?.[httpMethod.toUpperCase()];
  if (route) return route(event);

  return {
    statusCode: 404,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ error: "Route not found" }),
  };
};
