import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
}
`);

// RollDice の引数型
interface RollDiceArgs {
  numDice: number;
  numSides: number;
}

const root = {
  // リゾルバの第一引数にオブジェクトとしてパラメータが渡される。
  rollDice: ({ numDice, numSides }: RollDiceArgs) => {
    const output: number[] = [];

    for (let i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }

    return output;
  },
};

const app = express();
app.use(express.static('public'));
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
