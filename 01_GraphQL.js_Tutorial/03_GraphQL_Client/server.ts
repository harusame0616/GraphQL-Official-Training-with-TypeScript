import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const app = express();
app.use(express.static('public'));

// 02 Running Express GraphQL
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

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  })
);

// 05 PassingA Arguments
var schema2 = buildSchema(`
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
  }
`);

const root2 = {
  rollDice: ({ numDice, numSides }: { numDice: number; numSides: number }) => {
    var output: number[] = [];
    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
};

app.use(
  '/graphql2',
  graphqlHTTP({
    schema: schema2,
    rootValue: root2,
    graphiql: true,
  })
);

app.listen(4000);
console.log('Running a GraphQL API server at http://localhost:4000/graphql');
