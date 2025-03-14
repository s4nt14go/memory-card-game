import { expect, it } from 'vitest';
import request from 'supertest';
import app from '../../../server.mjs';
import Save, {possibleDifficulties} from "../../../models/save.mjs";
import User from "../../../models/user.mjs";
import {sortDirOptions, sortFieldOptions} from "./ListGames.mjs";
const chance = require('chance').Chance();

const pageSize = 99999;
const pageNumber = 1;
const sortField = chance.pickone(sortFieldOptions);
const sortDir = chance.pickone(Object.keys(sortDirOptions));

it('should list games', async () => {
  // First create a user
  const newUser = new User({
    username: chance.string(),
    password: 'test',
  });
  await newUser.save();
  // Then create a bunch of games
  const created = [];
  while (Math.random() > 0.3) {
    const newGame = new Save({
      userID: newUser._id,
      gameDate: chance.date(),
      failed: chance.natural(),
      difficulty: chance.pickone(possibleDifficulties),
      completed: chance.pickone([1,0]),
      timeTaken: chance.natural(),
    });
    await newGame.save();
    created.push(newGame);
  }

  const userID = newUser._id;
  const response = await request(app)
    .get(`/api/memory/list/${userID}?pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${sortField}&sortDir=${sortDir}`);

  expect(response.statusCode).toBe(200);
  expect(response.body).toEqual({
      games: expect.anything(),
      pageNumber,
      pageSize,
      sortField,
      sortDir,
      count: created.length,
  });
  expect(response.body.games.length).toBe(created.length);
  expect(response.body.games).toEqual(
    expect.arrayContaining(created.map(game => expect.objectContaining({
      userID: game.userID.toString(),
      gameDate: game.gameDate.toISOString(),
      failed: game.failed,
      difficulty: game.difficulty,
      completed: game.completed,
      timeTaken: game.timeTaken,
    })))
  );

  // Clean up
  await Save.deleteMany({userID});
});

it('should fail for an invalid input', async () => {
  // First create a user
  const newUser = new User({
    username: chance.string(),
    password: 'test',
  });
  await newUser.save();

  const userID = newUser._id;

  const sortDir = 'invalid';
  const response = await request(app)
    .get(`/api/memory/list/${userID}?pageSize=${pageSize}&pageNumber=${pageNumber}&sortField=${sortField}&sortDir=${sortDir}`);

  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual([{
    message: expect.any(String),
    type: 'InvalidSortDir',
    field: 'sortDir',
    status: 400,
  }]);

  // Clean up
  await Save.deleteMany({userID});
});