import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

export class ValidationError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super('ValidationError', opts);
    this.name = 'ValidationError';
  }
}
