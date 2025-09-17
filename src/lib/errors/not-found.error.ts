import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

export class NotFoundError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super('NotFoundError', opts);
    this.name = 'NotFoundError';
  }
}
