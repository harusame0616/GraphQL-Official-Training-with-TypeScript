import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'hello world';
  },
};

const app = express();
app.use(
  '/graphql', //  /graphql に GraphQLサーバーをマッピング
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // GraphQL の Webクライアント GraphiQLを有効にする。
  })
);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
