// export default server;
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { graphql, buildSchema } from 'graphql';
import { randomBytes } from 'crypto';

import RandomDie from './RandomDie.js';
import Message from './Message.js';

// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
    sumUp(one: Int!, two: Int): Int
    getDie(numSides: Int): RandomDie
    getMessage(id: ID!): Message
  }

  type Mutation {
    createDie(numSides: Int): RandomDie
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }

  type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int!]
  }

  input MessageInput {
    author: String
    content: String
  }

  type Message {
    id: ID!
    author: String
    content: String
  }
`);

const db = { dies: [], messages: [] };
// The root provides a resolver function for each API endpoint
var root = {
  hello: () => {
    return 'Hello world!';
  },
  sumUp: ({ one, two }) => one + two,
  getDie: ({ numSides }) => {
    return db.dies.find((die) => die.numSides === numSides);
  },
  createDie: ({ numSides }) => {
    const die = new RandomDie(numSides || 6);
    db.dies.push(die);
    return die;
  },
  getMessage: ({ id }) => {
    const message = db.messages.find((x) => x.id === id);
    if (!message) {
      throw new Error('no messages yet');
    }
    return message;
  },
  createMessage: ({ input }) => {
    const id = randomBytes(10).toString('hex');
    db.messages.push({ id, ...input });
    return new Message(id, input);
  },
  updateMessage: ({ id, input }) => {
    const message = db.messages.find((x) => x.id === id);
    if (!message) {
      throw new Error('no messages yet');
    }
    const index = db.messages.indexOf(message);
    db.messages[index] = { id, ...input };
    return new Message(id, input);
  },
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({ schema: schema, rootValue: root, graphiql: true })
);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');

export default app;
