import {Result} from "./Result.mjs";
import {CantBeLessThan1} from "./PositiveIntegerErrors.mjs";
import {N0} from "./N0.mjs";

export class PositiveInteger {
  props = {};

  /**
   * @desc Don't call constructor from outside the class, use **create** method instead.
   */
  constructor(value) {
    this.props.value = value;
  }

  /**
   * @returns {number}
   */
  get value() {
    return this.props.value;
  }

  /**
   * Try to create a positive integer
   * @param {number|string} value
   * @returns {Result}
   */
  static create(value) {

    const n0orErrors = N0.create(value);
    if (n0orErrors.isFailure)
      return Result.fail(n0orErrors.errors);

    const n0 = n0orErrors.value.value;

    const errors = [];
    if (n0 < 1)
      errors.push(new CantBeLessThan1());

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(new PositiveInteger(n0));

  }
}