import { expect, it } from 'vitest';
import { Authenticate } from './Authenticate.mjs';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

it(`calls the controller and doesn't call with userID`, async () => {

  // token for userID 67d29d5315fa3d292bfcd293
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ZDI5ZDUzMTVmYTNkMjkyYmZjZDI5MyIsImlhdCI6MTc0MjA1NDAwN30.12SlZ7bZHBX-6YjdsSHo_3ICafmLJu-8gdeKeS2FYwg';
  const req = {
    body: {
      someField: 'someValue',
    },
    headers: {
      authorization: `Bearer ${token}`,
    },
  };

  const controller = {
    execute(data, res) {
      expect(data).toEqual({
        ...req.body,
        userID: '67d29d5315fa3d292bfcd293',
      });
      expect(res).toBe('res')
    },
  };

  const decorated = new Authenticate(controller);

  await decorated.execute(req, 'res');
});

it(`returns unauthorized for an invalid token and doesn't call controller`, async () => {
  const req = {
    headers: {
      authorization: `Bearer invalid`,
    },
  };
  const res = {
    status: (code) => {
      expect(code).toBe(401);
      return res;
    },
    json: (data) => {
      expect(data).toEqual({ message: 'Unauthorized' });
    },
  };

  const controller = {
    execute() {
      throw new Error('Should not be called');
    },
  };

  const decorated = new Authenticate(controller);

  await decorated.execute(req, res);
});
