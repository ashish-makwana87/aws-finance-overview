import { routes } from "./routes/index.js";

export const handler = async (event) => {
  const path = event.requestContext.http.path;
  const httpMethod = event.requestContext.http.method.toUpperCase();

  //Routing event/request to designated controller
  const handlers = routes[path]?.[httpMethod];
  if (!handlers) {
    return {
      statusCode: 404,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Route not found" }),
    };
  }
  
  // handlersList is always an array
  const handlersList = Array.isArray(handlers) ? handlers : [handlers];
  
  for (const fn of handlersList) {
    const response = await fn(event); 
    if(response) return response; 
  }

};
