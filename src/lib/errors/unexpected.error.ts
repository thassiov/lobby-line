import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

/**
 * Should be used as a default error in try/catch blocks when there are not specific errors to assign
 * This is not interchangeable with 'NotExpectedError'
 */
export class UnexpectedError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super('UnexpectedError', opts);
    this.name = 'UnexpectedError';
  }
}
