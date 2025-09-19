import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from '../../lib/errors';
import { EndpointHandler } from '../../lib/types';
import { QueueService } from './queue.service';
import { ICreateQueueDto, IUpdateQueueDto } from './types/dto.type';

const router = express.Router();

function makeServiceEndpoints(queueService: QueueService): express.Router {
  router.post('/v1/queues/', createQueueEndpointFactory(queueService));

  router.get('/v1/queues/', listOrCountQueuesEndpointFactory(queueService));

  router.get('/v1/queues/:id', getQueueByIdEndpointFactory(queueService));

  router.patch('/v1/queues/:id', updateQueueByIdEndpointFactory(queueService));

  router.delete('/v1/queues/:id', deleteQueueByIdEndpointFactory(queueService));

  return router;
}

function createQueueEndpointFactory(
  queueService: QueueService
): EndpointHandler {
  return async function createQueueEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = await queueService.create(req.body as ICreateQueueDto);

    res.status(StatusCodes.CREATED).json({ id });
    return;
  };
}

function listOrCountQueuesEndpointFactory(
  queueService: QueueService
): EndpointHandler {
  return async function listOrCountQueuesEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const operation = req.query['q'] as string;

    let result;

    if (operation === 'list') {
      result = await queueService.listAll();
    } else if (operation === 'count') {
      const count = await queueService.countAll();
      result = { count };
    } else {
      throw new ValidationError({
        details: {
          input: { operation },
          errors: 'argument is not valid',
        },
        context: 'list or count queues',
      });
    }

    res.status(StatusCodes.OK).json(result);
    return;
  };
}

function getQueueByIdEndpointFactory(
  queueService: QueueService
): EndpointHandler {
  return async function getQueueByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;
    const queue = await queueService.getById(id);

    if (!queue) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(StatusCodes.OK).json({ queue });
    return;
  };
}

function updateQueueByIdEndpointFactory(
  queueService: QueueService
): EndpointHandler {
  return async function updateQueueByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;
    const dto = req.body as IUpdateQueueDto;
    const result = await queueService.updateById(id, dto);

    if (!result) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(StatusCodes.OK).send();
    return;
  };
}

function deleteQueueByIdEndpointFactory(
  queueService: QueueService
): EndpointHandler {
  return async function deleteQueueByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;

    await queueService.deleteById(id);

    res.status(StatusCodes.NO_CONTENT).send();
    return;
  };
}

export { makeServiceEndpoints };
