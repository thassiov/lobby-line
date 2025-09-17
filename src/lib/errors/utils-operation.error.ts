import { errors } from './application-error.list';
import { BaseCustomError, ErrorOpts } from './base-custom-error.error';

export class UtilsOperationError extends BaseCustomError {
  constructor(opts?: ErrorOpts) {
    super(errors.UTILS_OPERATION_ERROR.message, opts);
    this.name = errors.UTILS_OPERATION_ERROR.name;
  }
}
