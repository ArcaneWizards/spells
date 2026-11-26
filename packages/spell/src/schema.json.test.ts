import { it, expect } from '@jest/globals';
import SCHEMA from '../schema.json' with { type: 'json' };
import { getJSONSchema } from './index.js';

it('schema.json', () => {
  try {
    expect(getJSONSchema()).toEqual(SCHEMA);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(getJSONSchema(), null, 2));
    throw error;
  }
});
