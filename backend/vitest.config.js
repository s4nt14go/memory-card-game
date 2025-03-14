import { defineConfig } from 'vitest/config';

const options = {};
const { TEST_MODE } = process.env;
switch (TEST_MODE) {
  case 'unit':
    options.include = ['**/*.unit.js', '**/*.unit.mjs'];
    break;
  case 'e2e':
    options.include = ['**/*.e2e.js', '**/*.e2e.mjs'];
    break;

  default:
    throw new Error(`Unknown TEST_MODE: ${TEST_MODE}`);
}

export default defineConfig({
  test: options,
});