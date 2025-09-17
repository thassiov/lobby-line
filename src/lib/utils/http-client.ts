import axios from 'axios';
import { UtilsOperationError } from '../errors/utils-operation.error';

type MakeRequestOpts = {
  url: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
};

// @NOTE: this is stupid.
type MakeGetRequestOpts = Omit<MakeRequestOpts, 'body' | 'method' | 'url'>;
type MakePostRequestOpts = Omit<MakeRequestOpts, 'method' | 'url'>;
type MakePatchRequestOpts = Omit<MakeRequestOpts, 'method' | 'url'>;
type MakeDeleteRequestOpts = Omit<MakeRequestOpts, 'method' | 'url'>;

type HttpClient = {
  get: typeof makeGetRequest;
  post: typeof makePostRequest;
  patch: typeof makePatchRequest;
  delete: typeof makeDeleteRequest;
};

async function makeRequest<T>(requestOpts: MakeRequestOpts): Promise<T> {
  try {
    // just making sure we aren't overwriting the content type
    if (requestOpts.headers?.['Content-Type'] == undefined) {
      requestOpts.headers = {
        ...requestOpts.headers,
        'Content-Type': 'application/json',
      };
    }

    const response = await axios.request<T>(requestOpts);
    return response.data;
  } catch (error) {
    const errorInstance = new UtilsOperationError({
      details: {
        input: requestOpts,
      },
      cause: error as Error,
    });

    throw errorInstance;
  }
}

async function makeGetRequest<T>(
  url: string,
  opts?: MakeGetRequestOpts
): Promise<T> {
  const getRequestOptions = opts ? { ...opts } : {};
  return makeRequest<T>({ ...getRequestOptions, url, method: 'GET' });
}

async function makePostRequest<T>(
  url: string,
  opts: MakePostRequestOpts
): Promise<T> {
  return makeRequest<T>({ ...opts, url, method: 'POST' });
}

async function makePatchRequest<T>(
  url: string,
  opts: MakePatchRequestOpts
): Promise<T> {
  return makeRequest<T>({ ...opts, url, method: 'PATCH' });
}

async function makeDeleteRequest<T>(
  url: string,
  opts?: MakeDeleteRequestOpts
): Promise<T> {
  const deleteRequestOptions = opts ? { ...opts } : {};
  return makeRequest<T>({ ...deleteRequestOptions, url, method: 'DELETE' });
}

const httpClient: HttpClient = {
  get: makeGetRequest,
  post: makePostRequest,
  patch: makePatchRequest,
  delete: makeDeleteRequest,
};

export { httpClient };

export type { HttpClient };
