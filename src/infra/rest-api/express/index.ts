import { randomUUID } from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { StatusCodes } from 'http-status-codes';
import pinoHttp from 'pino-http';
import {
  ConflictError,
  NotFoundError,
  PermissionError,
  ValidationError,
} from '../../../lib/errors';
import { RestApiConfig } from '../../../lib/types';

function setupExpressRestApi(
  routers: express.Router[] | express.Router,
  restApi: RestApiConfig
) {
  const api = express();

  api.use(helmet());
  api.use(
    pinoHttp({
      genReqId: function (req, res) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const existingID = req.id ?? req.headers['x-request-id'];
        if (existingID) {
          return existingID;
        }
        const id = randomUUID();
        res.setHeader('X-Request-Id', id);
        return id;
      },
    })
  );
  api.use(express.json());
  api.use(express.urlencoded({ extended: true }));

  if (Array.isArray(routers)) {
    routers.forEach((router) => api.use(router));
  } else {
    api.use(routers);
  }

  api.use(errorHandler);

  return function startRestApi() {
    const serverPort = restApi.port;
    api.listen(serverPort, () => {
      pinoHttp().logger.info(
        `Server started at http://0.0.0.0:${serverPort.toString()}`
      );
    });
  };
}

function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _: NextFunction
) {
  req.log.error(err);

  if (err instanceof NotFoundError) {
    return res.status(StatusCodes.NOT_FOUND).json();
  }

  if (err instanceof ValidationError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      status: 'error',
      message: 'validation error',
      details: err.details,
    });
  }

  if (err instanceof PermissionError) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      status: 'error',
      message: 'permission error',
      details: err.details,
    });
  }

  if (err instanceof ConflictError) {
    return res.status(StatusCodes.CONFLICT).json({
      status: 'error',
      message: 'conflict: resource already exist',
      details: err.details,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    status: 'error',
    message: 'Internal Server Error',
  });
}

export { setupExpressRestApi };
