import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
type Test {
  x: String!
}

type Mutation {
    setMessage(message:String!): String!
}

type Query {
  getMessage: String!
}
`);

const inmemoryDB = {
  message: '',
};

const root = {
  setMessage: ({ message }: { message: string }) => {
    inmemoryDB.message = message;

    return inmemoryDB.message;
  },
  getMessage: () => {
    return inmemoryDB.message;
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

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
