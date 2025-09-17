import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { EndpointHandler } from '../../lib/types';
import { SampleService } from './sample.service';
import { ICreateSampleDto, IUpdateSampleDto } from './types/dto.type';

const router = express.Router();

function makeServiceEndpoints(sampleService: SampleService): express.Router {
  router.post('/v1/samples/', createSampleEndpointFactory(sampleService));

  router.get('/v1/samples/', listenToSampleTopicEndpointFactory(sampleService));

  router.get('/v1/samples/:id', getSampleByIdEndpointFactory(sampleService));

  router.patch(
    '/v1/samples/:id',
    updateSampleByIdEndpointFactory(sampleService)
  );

  router.delete(
    '/v1/samples/:id',
    deleteSampleByIdEndpointFactory(sampleService)
  );

  return router;
}

function createSampleEndpointFactory(
  sampleService: SampleService
): EndpointHandler {
  return async function createSampleEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = await sampleService.create(req.body as ICreateSampleDto);

    res.status(StatusCodes.CREATED).json({ id });
    return;
  };
}

function listenToSampleTopicEndpointFactory(
  sampleService: SampleService
): EndpointHandler {
  return async function listenToSampleTopicEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const topic = req.query['topic'] as string;
    await sampleService.consumeMessagesFromTopic(topic);

    res.status(StatusCodes.OK).send();
    return;
  };
}

function getSampleByIdEndpointFactory(
  sampleService: SampleService
): EndpointHandler {
  return async function getSampleByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;
    const sample = await sampleService.getById(id);

    if (!sample) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(StatusCodes.OK).json({ sample });
    return;
  };
}

function updateSampleByIdEndpointFactory(
  sampleService: SampleService
): EndpointHandler {
  return async function updateSampleByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;
    const dto = req.body as IUpdateSampleDto;
    const result = await sampleService.updateById(id, dto);

    if (!result) {
      res.status(StatusCodes.NOT_FOUND).send();
      return;
    }

    res.status(StatusCodes.OK).send();
    return;
  };
}

function deleteSampleByIdEndpointFactory(
  sampleService: SampleService
): EndpointHandler {
  return async function deleteSampleByIdEndpoint(
    req: Request,
    res: Response
  ): Promise<void> {
    const id = req.params['id']!;

    await sampleService.deleteById(id);

    res.status(StatusCodes.NO_CONTENT).send();
    return;
  };
}

export { makeServiceEndpoints };
