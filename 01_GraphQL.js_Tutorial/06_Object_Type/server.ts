import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
type RandomDie {
    numSides: Int!
    rollOnce: Int!
    roll(numRolls: Int!): [Int!]!
}

type Query {
    getDie(numSides: Int): RandomDie
}
`);

class RandomDie {
  constructor(private _numSides: number) {}

  get numSides() {
    return this._numSides;
  }

  rollOnce() {
    return 1 + Math.floor(Math.random() * this._numSides);
  }

  // 引数はオブジェクトで渡されるので分割代入で受け取っている
  roll({ numRolls }: { numRolls: number }) {
    const output: number[] = [];

    for (let i = 0; i < numRolls; i++) {
      output.push(this.rollOnce());
    }

    return output;
  }
}

interface GetDieArg {
  numSides: number;
}

const root = {
  getDie: ({ numSides }: GetDieArg) => {
    return new RandomDie(numSides || 6);
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
