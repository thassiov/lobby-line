import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

export class ConflictError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super('ConflictError', opts);
    this.name = 'ConflictError';
  }
}
