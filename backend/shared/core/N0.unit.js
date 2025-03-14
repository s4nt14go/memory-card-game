import { expect, test, it, describe } from 'vitest';
import { N0 } from './N0.mjs';
import {expectErrorResult, expectErrorsResult} from '../utils/test';
import {CantBeLessThan0, ShouldBeInteger} from "./N0Errors.mjs";
const chance = require('chance').Chance();

describe('success', () => {
  test.each([0, 1, chance.natural()])(`creates from number %s`, (value) => {
    const result = N0.create(value);

    expect(result).toMatchObject({
      isSuccess: true,
      value: {
        value,
      },
    });
  });

  test.each([['0', 0], ['900', 900]])(`creates from valid string %s`, (string, number) => {
    const result = N0.create(string);

    expect(result).toMatchObject({
      isSuccess: true,
      value: {
        value: number,
      },
    });
  });
});

describe(`creation fails if`, () => {
  it(`input is a string containing non-digit characters`, () => {
    const result = N0.create('1a');

    expectErrorResult({
      result,
      error: `OnlyDigitsAllowedForString`,
      code: 400,
    });
  });

  it(`input is not a number`, () => {
    const result = N0.create({});

    expectErrorResult({
      result,
      error: `ShouldBeNumber`,
      code: 400,
    });
  });

  it(`input is NaN`, () => {
    const result = N0.create(NaN);

    expectErrorResult({
      result,
      error: `ShouldBeNumber`,
      code: 400,
    });
  });

  it(`input isn't an integer`, () => {
    const result = N0.create(1.5);

    expectErrorResult({
      result,
      error: `ShouldBeInteger`,
      code: 400,
    });
  });

  it(`input is less than 0`, () => {
    const result = N0.create(-1);

    expectErrorResult({
      result,
      error: `CantBeLessThan0`,
      code: 400,
    });
  });

  it(`multiple errors are found for a number`, () => {
    const result = N0.create(-1.5);

    expectErrorsResult({
      result,
      errors: [
        new CantBeLessThan0(),
        new ShouldBeInteger(),
      ]
    });
  });
});
