import {isValidObjectId} from "mongoose";

export const isMongoId = (id) => id !== undefined && id !== null && isValidObjectId(id)

const StatusSuccess = {
  OK: 200,
  CREATED: 201,
}

export const StatusError = {
  BAD_REQUEST: 400,
}

export const Status = {
  ...StatusSuccess,
  ...StatusError,
};