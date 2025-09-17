import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

export class PermissionError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super('PermissionError', opts);
    this.name = 'PermissionError';
  }
}
