import axios from 'axios';
import assert from 'assert';

import app from '../src/index.js';

describe('GraphQL requests', () => {
  describe('{hello}', () => {
    it('should return hello world', async () => {
      const { status, data } = await axios.post(
        'http://127.0.0.1:4000/graphql',
        {
          query: '{hello}',
        }
      );

      assert.equal(200, status);
      assert.deepStrictEqual({ data: { hello: 'Hello world!' } }, data);
    });
  });

  describe('{sumUp}', () => {
    it('should return 30', async () => {
      const one = 10;
      const two = 20;
      const query = `query Sum($one: Int!, $two: Int) {
        sumUp(one: $one, two: $two)
}`;
      const { status, data } = await axios.post(
        'http://127.0.0.1:4000/graphql',
        {
          query,
          variables: { one, two },
        }
      );
      assert.deepStrictEqual({ data: { sumUp: 30 } }, data);
    });
  });

  describe('create + get + update + Message', () => {
    it('should return', async () => {
      const author = 'andy';
      const content = 'hope is a good thing';
      const createQuery = `mutation CreateMessage($input: MessageInput) {
        createMessage(input: $input) {
          id
        }
}`;

      var { status, data } = await axios.post('http://127.0.0.1:4000/graphql', {
        query: createQuery,
        variables: {
          input: {
            author,
            content,
          },
        },
      });

      const { id } = data.data.createMessage;

      const getQuery = `query GetMessage($id: ID!) {
        getMessage(id: $id) {
          id
          author
          content
        }
}`;

      var { status, data } = await axios.post('http://127.0.0.1:4000/graphql', {
        query: getQuery,
        variables: {
          id,
        },
      });
      assert.deepStrictEqual(
        { data: { getMessage: { id, author, content } } },
        data
      );

      const updateQuery = `mutation UpdateMessage($id: ID!, $input: MessageInput) {
          updateMessage(id: $id, input: $input) {
            author
          }
  }`;

      const newAuthor = 'John Doe';
      var { status, data } = await axios.post('http://127.0.0.1:4000/graphql', {
        query: updateQuery,
        variables: {
          id,
          input: {
            author: newAuthor,
          },
        },
      });
      assert.deepStrictEqual(
        { data: { updateMessage: { author: newAuthor } } },
        data
      );
    });
  });
});
