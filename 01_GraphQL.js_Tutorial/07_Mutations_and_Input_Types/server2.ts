import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import crypto from 'crypto';

const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

interface MessageInput {
  content: string;
  author: string;
}

class Message {
  private _content: string;
  private _author: string;
  constructor(private _id: string, { content, author }: MessageInput) {
    this._content = content;
    this._author = author;
  }

  get id() {
    return this._id;
  }

  get content() {
    return this._content;
  }
  get author() {
    return this._author;
  }
}

type MessageInfo = {
  content: string;
  author: string;
};

const inmemoryDB: {
  [key: string]: MessageInfo;
} = {};

const root = {
  getMessage: ({ id }: { id: string }) => {
    if (!inmemoryDB[id]) {
      throw new Error('no message exists with id ' + id);
    }

    return new Message(id, inmemoryDB[id]);
  },
  createMessage: ({ input }: { input: MessageInfo }) => {
    const id = crypto.randomUUID();

    inmemoryDB[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({ id, input }: { id: string; input: MessageInput }) => {
    if (!inmemoryDB[id]) {
      throw new Error('no message exists with id ' + id);
    }

    inmemoryDB[id] = input;
    return new Message(id, input);
  },
};

const app = express();
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

app.listen(4001, () => {
  console.log('Running a GraphQL API server2 at localhost:4001/graphql');
});
