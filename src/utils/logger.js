const createLog = ({
  level,
  service = "user-service",
  event,
  message,
  metadata = {},
}) => ({
  timestamp: new Date().toISOString(),
  level,
  service,
  event,
  message,
  ...metadata,
});

export const logger = {
  info({ event, message, service, metadata = {} }) {
    console.log(
      JSON.stringify(
        createLog({
          level: "INFO",
          service,
          event,
          message,
          metadata,
        })
      )
    );
  },

  warn({ event, message, service, metadata = {} }) {
    console.warn(
      JSON.stringify(
        createLog({
          level: "WARN",
          service,
          event,
          message,
          metadata,
        })
      )
    );
  },

  error({ event, message, service, metadata = {} }) {
    console.error(
      JSON.stringify(
        createLog({
          level: "ERROR",
          service,
          event,
          message,
          metadata,
        })
      )
    );
  },
};