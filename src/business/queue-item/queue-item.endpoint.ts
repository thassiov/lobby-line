import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ValidationError } from '../../lib/errors';
import { EndpointHandler } from '../../lib/types';
import { QueueItemService } from './queue-item.service';
import { ICreateQueueItemDto } from './types/dto.type';

const router = express.Router();

function makeServiceEndpoints(
  queueItemService: QueueItemService
): express.Router {
  router.post(
    '/v1/queues/:queueId/queueItems/',
    createQueueItemEndpointFactory(queueItemService)
  );

  router.get(
    '/v1/queues/:queueId/queueItems/',
    listOrCountOpenQueueItemsEndpointFactory(queueItemService)
  );

  router.get(
    '/v1/queues/:queueId/queueItems/:id',
    getQueueItemByIdEndpointFactory(queueItemService)
  );

  router.patch(
    '/v1/queues/:queueId/queueItems/:id/close',
    setQueueItemStatusAsClosedByIdEndpointFactory(queueItemService)
  );

  router.delete(
    '/v1/queues/:queueId/queueItems/:id',
    deleteQueueItemByIdEndpointFactory(queueItemService)
  );

  return router;
}

function createQueueItemEndpointFactory(
  queueItemService: QueueItemService
): EndpointHandler {
  return async function createQueueItemEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const queueId = req.params['queueId']!;

    const id = await queueItemService.create({
      ...req.body,
      queueId,
    } as ICreateQueueItemDto);

    res.status(StatusCodes.CREATED).json({ id });
    return;
  };
}

function listOrCountOpenQueueItemsEndpointFactory(
  queueItemService: QueueItemService
): EndpointHandler {
  return async function listOrCountOpenQueueItemsEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const queueId = req.params['queueId']!;
    const operation = req.query['q'] as string;

    let result;

    if (operation === 'list') {
      result = await queueItemService.listAllByQueueId(queueId, 'open');
    } else if (operation === 'count') {
      const count = await queueItemService.countAllByQueueId(queueId, 'open');
      result = { count };
    } else {
      throw new ValidationError({
        details: {
          input: { operation },
          errors: 'argument is not valid',
        },
        context: 'list or count queue items',
      });
    }

    res.status(StatusCodes.OK).json(result);
    return;
  };
}

function getQueueItemByIdEndpointFactory(
  queueItemService: QueueItemService
): EndpointHandler {
  return async function getQueueItemByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;
    const queueId = req.params['queueId']!;

    const queueItem = await queueItemService.getById(id, queueId);

    if (!queueItem) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(StatusCodes.OK).json({ queueItem });
    return;
  };
}

function setQueueItemStatusAsClosedByIdEndpointFactory(
  queueItemService: QueueItemService
): EndpointHandler {
  return async function setQueueItemStatusAsClosedByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const queueItemId = req.params['id']!;
    const queueId = req.params['queueId']!;
    const result = await queueItemService.updateItemStatusById(
      queueItemId,
      queueId,
      {
        status: 'closed',
      }
    );

    if (!result) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(StatusCodes.OK).send();
    return;
  };
}

function deleteQueueItemByIdEndpointFactory(
  queueItemService: QueueItemService
): EndpointHandler {
  return async function deleteQueueItemByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;
    const queueId = req.params['queueId']!;

    await queueItemService.deleteById(id, queueId);

    res.status(StatusCodes.NO_CONTENT).send();
    return;
  };
}

export { makeServiceEndpoints };
