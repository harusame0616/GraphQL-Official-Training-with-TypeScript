# Passing Arguments

## インストールと実行

```sh
npm i && npm start
```

open http://localhost:4000/ in your browser.

## 説明

GraphQLでもエンドポイントに引数を持たせることが可能です。

引数には名前と型を指定する必要があります。

```graphql
type Query {
  rollDice(numDice: Int!, numSides: Int): [Int]
}
```

numDiceは `!` によってnullではないことが保証されるため、サーバーのバリデーションを省略できます。

引数があるAPIではリゾルバの最初の引数にオブジェクトとして渡される。

```ts
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

```