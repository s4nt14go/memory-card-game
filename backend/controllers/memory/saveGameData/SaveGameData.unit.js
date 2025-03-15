import {expect, it, describe, test} from 'vitest';
import {SaveGameData} from "./SaveGameData.mjs";
import {InvalidUserId} from "../../../shared/project/Errors.mjs";
import {difficultyOptions, possibleCompleted} from "./SaveGameData.mjs";

const chance = require('chance').Chance();
// const Save = SaveModule.Save;

const games = [];
while (Math.random() > 0.5) {
  games.push('dummy');
}

class Save {
  constructor() {}
  save() {}
}

const input = {
  userID: '67d29d5315fa3d292bfcd293',
  gameDate: chance.date().toISOString(),
  difficulty: chance.pickone(difficultyOptions),
  failed: chance.natural(),
  completed: chance.pickone(possibleCompleted),
  timeTaken: chance.integer({ min: 0}),
};

it(`succeeds`, async () => {

  class Save {
    constructor(data) {
      expect(data).toEqual(input);
    }
    save() {}
  }

  const controller = new SaveGameData({models: {Save}});
  const response = await controller.executeImpl(input);

  expect(response.status).toBe(201);
});

describe(`fails`, () => {
  test(`if userID is invalid`, async () => {
    const controller = new SaveGameData({models: {Save}});

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
    ['gameDate', 'difficulty', 'failed', 'completed', 'timeTaken']
  )(`if %s is invalid`, async (field) => {
    const controller = new SaveGameData({models: {Save}});

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
    const controller = new SaveGameData({models: {Save}});

    const response = await controller.executeImpl({
      ...input,
      userID: 'invalid',
      difficulty: 'invalid',
      failed: 'invalid',
      completed: 'invalid',
      timeTaken: 'invalid',
    });

    expect(response.status).toBe(400);
    expect(response.result).toHaveLength(5);
  });

  test(`with 500 if executeImpl throws`, async () => {
    const controller = new SaveGameData({models: {Save}});

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
