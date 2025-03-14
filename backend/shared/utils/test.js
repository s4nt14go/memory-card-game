import { expect } from 'vitest';

export function expectErrorResult({
  result,
  error,
  code,
  field,
}) {
  expect(result).toMatchObject({
    isFailure: true,
    errors: [{
      type: error,
      message: expect.any(String),
      status: code,
      ... field? { field } : {},
    }],
  });
}

export function expectErrorsResult({
  result,
  errors,
}) {
  expect(result).toMatchObject({
    isFailure: true,
    errors,
  });
}