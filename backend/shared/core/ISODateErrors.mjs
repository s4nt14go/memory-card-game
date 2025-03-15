import { BaseError } from "./BaseError.mjs";

export class ShouldBeString extends BaseError {
  constructor() {
    super({
      message: `Should be a string.`,
      status: 400,
    });
  }
}

export class InvalidDateString extends BaseError {
  constructor() {
    super({
      message: `Invalid date string.`,
      status: 400,
    });
  }
}