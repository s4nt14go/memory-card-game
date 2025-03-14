import { BaseError } from "../../../shared/core/BaseError.mjs";

export class SortFieldIsRequired extends BaseError {
  constructor() {
    super({
      message: `Sort field is required.`,
      status: 400,
    });
  }
}

export class InvalidSortField extends BaseError {
  constructor() {
    super({
      message: `Invalid sort field.`,
      status: 400,
    });
  }
}

export class SortDirIsRequired extends BaseError {
  constructor() {
    super({
      message: `Sort direction is required.`,
      status: 400,
    });
  }
}

export class InvalidSortDir extends BaseError {
  constructor() {
    super({
      message: `Invalid sort direction.`,
      status: 400,
    });
  }
}