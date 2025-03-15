import {Result} from "./Result.mjs";
import {InvalidDateString, ShouldBeString} from "./ISODateErrors.mjs";

export class ISODate {
  props = {};

  /**
   * @desc Don't call constructor from outside the class, use **create** method instead.
   */
  constructor(value) {
    this.props.value = value;
  }

  /**
   * @desc ISO 8601 string
   * @returns {String}
   */
  get value() {
    return this.props.value;
  }

  /**
   * @param {string} value
   * @returns {Result}
   */
  static create(value) {

    if (typeof value !== 'string')
      return Result.fail([new ShouldBeString()]);

    const date = new Date(value);
    const isDate = isJSDate(date);
    if (!isDate) return Result.fail([new InvalidDateString()]);

    return Result.ok(new ISODate(value));
  }
}

function isJSDate(value) {
  return (
    !!value &&
    typeof value.getTime === 'function' &&
    !Number.isNaN(value.getTime())
  );
}