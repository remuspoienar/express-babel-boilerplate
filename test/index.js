import axios from 'axios';
import assert from 'assert';

import app from '../src/index.js';

describe('/test route', () => {
  describe('GET', () => {
    it('should return a string', async () => {
      const { status, data } = await axios.get('http://127.0.0.1:4000/test');

      assert.equal(200, status);
      assert.deepStrictEqual({ test: 'Test' }, data);
    });
  });
});
