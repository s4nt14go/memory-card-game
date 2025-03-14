import { BaseError } from "./BaseError.mjs";

export class OnlyDigitsAllowedForString extends BaseError {
  constructor() {
    super({
      message: `Only digits allowed for string.`,
      status: 400,
    });
  }
}

export class ShouldBeNumber extends BaseError {
  constructor() {
    super({
      message: `Should be a number.`,
      status: 400,
    });
  }
}

export class CantBeLessThan0 extends BaseError {
  constructor() {
    super({
      message: `Can't be less than 0.`,
      status: 400,
    });
  }
}

export class ShouldBeInteger extends BaseError {
  constructor() {
    super({
      message: `Should be an integer.`,
      status: 400,
    });
  }
}