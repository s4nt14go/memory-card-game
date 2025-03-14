import {BaseError} from "./BaseError.mjs";

export class Result {
  constructor(isSuccess, errors, value) {

    if (typeof isSuccess !== 'boolean')
      throw new Error('InvalidOperation: isSuccess needs to be a boolean');


    if (isSuccess && errors)
      throw new Error(
        'InvalidOperation: A result cannot be successful and contain errors',
      );

    if (!isSuccess && !errors){
      throw new Error(
        'InvalidOperation: A failing result needs to contain errors',
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.errors = errors;
    this._value = value;

    Object.freeze(this);
  }

  get value() {
    if (!this.isSuccess) {
      console.log('this:', this);
      throw new Error("Can't get value when Result didn't succeeded.");
    }
    if (this._value === undefined) {
      console.log('this:', this);
      throw new Error(`Can't get value when Result._value is undefined.`);
    }
    return this._value;
  }

  static ok(value) {
    return new Result(true, null, value);
  }

  static fail(errors) {
    if (!errors || !errors.length) {
      throw Error('InvalidOperation: A failing result needs to contain errors');
    }
    if (!errors.every((error) => error instanceof BaseError)) {
      throw Error('InvalidOperation: errors should be an array of BaseError');
    }

    return new Result(false, errors, null);
  }
}