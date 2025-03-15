import { BaseError } from "../../../shared/core/BaseError.mjs";

export class DifficultyIsRequired extends BaseError {
  constructor() {
    super({
      message: `Difficulty field is required.`,
      status: 400,
    });
  }
}

export class InvalidDifficultyField extends BaseError {
  constructor() {
    super({
      message: `Invalid difficulty field.`,
      status: 400,
    });
  }
}

export class CompletedIsRequired extends BaseError {
  constructor() {
    super({
      message: `Completed is required.`,
      status: 400,
    });
  }
}

export class InvalidCompletedField extends BaseError {
  constructor() {
    super({
      message: `Invalid completed field.`,
      status: 400,
    });
  }
}