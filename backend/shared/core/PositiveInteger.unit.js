import { expect, test, it, describe } from 'vitest';
import { PositiveInteger } from './PositiveInteger.mjs';
import {expectErrorResult} from '../utils/test';
import {CantBeLessThan0} from "./N0Errors.mjs";
import {CantBeLessThan1} from "./PositiveIntegerErrors.mjs";
const chance = require('chance').Chance();

describe('success', () => {
  test(`creation from a valid number`, () => {
    const value = chance.natural({ min: 1 });

    const result = PositiveInteger.create(value);

    expect(result).toMatchObject({
      isSuccess: true,
      value: {
        value,
      },
    });
  });

  test.each([['1', 1], ['900', 900]])(`creation from valid string "%s"`, (string, number) => {
    const result = PositiveInteger.create(string);

    expect(result).toMatchObject({
      isSuccess: true,
      value: {
        value: number,
      },
    });
  });
});

describe(`failure`, () => {

  it(`relays error from N0 creation if it fails`, () => {
    const result = PositiveInteger.create(-1);

    expectErrorResult({
      result,
      error: `CantBeLessThan0`,
      code: 400,
    });
  });

  test(`for less than 1`, () => {
    const result = PositiveInteger.create(0);

    expectErrorResult({
      result,
      error: `CantBeLessThan1`,
      code: 400,
    });
  });
});
