import {BaseError} from "../core/BaseError.mjs";
import {StatusError} from "./utils.mjs";

export class InvalidUserId extends BaseError {
  constructor() {
    super({
      message: `Invalid user ID.`,
      status: 400,
    });
  }
}


export const formatErrors = (errors) => {
  if (!errors.length) throw Error(`Empty errors array`);
  const status = errors.length === 1 ? errors[0].status : StatusError.BAD_REQUEST;
  return { status, result: errors };
};