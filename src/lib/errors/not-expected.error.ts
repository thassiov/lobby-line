import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

/**
 * Should be used when a condition is 'really' unlikely to happen but we want to signal it could, even though we don't have
 *  an action to recover from it
 * This is not interchangeable with 'UnexpectedError'
 */
export class NotExpectedError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super('NotExpectedError', opts);
    this.name = 'NotExpectedError';
  }
}
