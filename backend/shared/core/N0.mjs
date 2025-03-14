import {Result} from "./Result.mjs";
import {CantBeLessThan0, OnlyDigitsAllowedForString, ShouldBeInteger, ShouldBeNumber} from "./N0Errors.mjs";

export class N0 {
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
   * Try to create a natural number including zero
   * @param {number|string} value
   * @returns {Result}
   */
  static create(value) {

    const errors = [];

    switch (typeof value) {
      case 'string':
        if (!/^\d+$/.test(value))
          errors.push(new OnlyDigitsAllowedForString());
        else
          value = parseInt(value);
        break;

      case 'number':
        if (isNaN(value))
          errors.push(new ShouldBeNumber());
        break;

      default:
        errors.push(new ShouldBeNumber());
        break;
    }

    if (errors.length > 0) return Result.fail(errors);

    if (value < 0)
      errors.push(new CantBeLessThan0());

    if (!Number.isInteger(value))
      errors.push(new ShouldBeInteger());

    if (errors.length > 0) return Result.fail(errors);

    return Result.ok(new N0(value));

  }
}