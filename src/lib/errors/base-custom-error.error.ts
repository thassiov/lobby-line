export type ErrorOpts = {
  details?: Record<string, unknown>;
  cause?: Error;
  context?: string;
};

export class BaseCustomError extends Error {
  details?: Record<string, unknown>;
  cause?: Error;
  context?: string;

  constructor(message: string, opts?: ErrorOpts) {
    super(message);
    this.name = 'BaseCustomError';

    if (opts) {
      if (opts.context) {
        this.context = opts.context;
      }

      if (opts.details) {
        this.details = opts.details;
      }

      if (opts.cause) {
        this.cause = opts.cause;
        if (opts.cause.message) {
          this.message += `: ${opts.cause.message}`;
        }
      }
    }
  }

  unwrapCause(): Error {
    if (this.cause instanceof BaseCustomError) {
      return this.cause.unwrapCause();
    }

    if (this.cause instanceof Error) {
      return this.cause;
    }

    return this;
  }
}
