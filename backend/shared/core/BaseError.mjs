const StatusError  =
  {
    CONFLICT: 409,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500,
    BAD_GATEWAY: 502,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    GONE: 410,
    TOO_MANY_REQUESTS: 429,
    }

export class BaseError {

  constructor({ message, status }) {

    if (typeof message !== 'string' || !/[a-zA-Z]/.test(message))
      throw new Error('InvalidOperation: message needs to be a non-empty string');
    if (!Object.values(StatusError).includes(status))
      throw new Error('InvalidOperation: status needs to be a StatusError');

    this.message = message;
    this.status = status;
    this.type = this.constructor.name;
  }

  setField(field) {
    if (typeof field !== 'string' || !/[a-zA-Z]/.test(field))
      throw new Error('InvalidOperation: message needs to be a non-empty string');

    if (this.field) throw Error(`Field already set`);
    this.field = field;
    return this;
  }
}