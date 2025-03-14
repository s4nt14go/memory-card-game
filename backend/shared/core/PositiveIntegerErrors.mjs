import { BaseError } from "./BaseError.mjs";

export class CantBeLessThan1 extends BaseError {
  constructor() {
    super({
      message: `Can't be less than 1.`,
      status: 400,
    });
  }
}