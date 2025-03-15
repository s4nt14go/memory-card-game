import { expect, it } from 'vitest';
import request from 'supertest';
import app from '../../../server.mjs';
import Save, {possibleDifficulties} from "../../../models/save.mjs";
import User from "../../../models/user.mjs";
const chance = require('chance').Chance();

const input = {
  gameDate: chance.date(),
  failed: chance.natural(),
  difficulty: chance.pickone(possibleDifficulties),
  completed: chance.pickone([1,0]),
  timeTaken: chance.natural(),
}

it('should save a game', async () => {
  // First create a user
  const newUser = new User({
    username: chance.string(),
    password: 'test',
  });
  await newUser.save();
  const userID = newUser._id;

  const response = await request(app)
    .post(`/api/memory/save`).send({
      ...input,
      userID,
    });

  expect(response.statusCode).toBe(201);

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
  console.log(process.env);
  const response = await request(app)
    .post(`/api/memory/save`).send({
      ...input,
      userID: newUser._id,
      timeTaken: 'invalid',
    });

  expect(response.statusCode).toBe(400);
  expect(response.body).toEqual([{
    message: expect.any(String),
    type: expect.any(String),
    field: 'timeTaken',
    status: 400,
  }]);

  // Clean up
  await Save.deleteMany({userID});
});