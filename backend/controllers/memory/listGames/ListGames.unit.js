import {expect, it, vi, describe, test} from 'vitest';
import {ListGames, sortDirOptions, sortFieldOptions} from "./ListGames.mjs";
import {InvalidUserId} from "../../../shared/project/Errors.mjs";

const chance = require('chance').Chance();

const games = [];
while (Math.random() > 0.5) {
  games.push('dummy');
}

const Save = {
  countDocuments() {
    return games.length;
  },
  find: vi.fn(() => Save),
  skip: vi.fn(() => Save),
  limit: vi.fn(() => Save),
  sort: vi.fn(() => games),
};

const input = {
  userID: '67d29d5315fa3d292bfcd293',
  pageNumber: chance.natural(),
  pageSize: chance.natural(),
  sortField: chance.pickone(sortFieldOptions),
  sortDir: chance.pickone(Object.keys(sortDirOptions)),
};

it(`succeeds`, async () => {

  const controller = new ListGames({models: {Save}});

  const response = await controller.executeImpl(input);

  expect(response).toEqual({
    status: 200,
    result: {
      games,
      pageNumber: input.pageNumber,
      pageSize: input.pageSize,
      sortField: input.sortField,
      sortDir: input.sortDir,
      count: games.length,
    },
  });
});

describe(`fails`, () => {
  test(`if userID is invalid`, async () => {
    const controller = new ListGames({models: {Save}});

    const response = await controller.executeImpl({
      ...input,
      userID: 'invalid',
    });

    expect(response).toEqual({
      status: 400,
      result: [new InvalidUserId().setField('userID')],
    });
  });

  test.each(
    ['pageSize', 'pageNumber', 'sortField', 'sortDir']
  )(`if %s is invalid`, async (field) => {
    const controller = new ListGames({models: {Save}});

    const response = await controller.executeImpl({
      ...input,
      [field]: 'invalid',
    });

    expect(response).toEqual({
      status: 400,
      result: [
        expect.objectContaining({
          field,
          message: expect.any(String),
          status: 400,
          type: expect.any(String),
        }),
      ],
    });
  });

  test(`returning multiple errors`, async () => {
    const controller = new ListGames({models: {Save}});

    const response = await controller.executeImpl({
      ...input,
      userID: 'invalid',
      pageSize: 0,
      pageNumber: 0,
      sortField: 'invalid',
      sortDir: 'invalid',
    });

    expect(response.status).toBe(400);
    expect(response.result).toHaveLength(5);
  });

  test(`with 500 if executeImpl throws`, async () => {
    const controller = new ListGames({models: {Save}});

    const res = {
      status: (code) => {
        expect(code).toBe(500);
        return res;
      },
      json: (data) => {
        expect(data).toEqual({message: expect.any(String), error: expect.any(Error)});
      },
    }

    await controller.execute('req to throw', res);
  });
});
