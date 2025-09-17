import pino from 'pino';

function setupLogger(moduleName: string) {
  const moduleLogger = pino(pino.destination({ sync: true })).child({ module: moduleName });

  const logger = {
    info: (...args: unknown[]) => {
      moduleLogger.info(args);
    },
    debug: (...args: unknown[]) => {
      moduleLogger.debug(args);
    },
    warn: (...args: unknown[]) => {
      moduleLogger.warn(args);
    },
    error: (...args: unknown[]) => {
      moduleLogger.error(args);
    },
  };

  return logger;
}

export { setupLogger };
