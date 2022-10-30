# Basic Types

## インストールと実行

```sh
npm i && npm start
```

opne http://localhost:4000/ in your browser.

## 説明

GraphQLでの基本型とJSでの対応は以下の5つ。

- `String` : 文字型 → string
- `Int` : 整数型 → number
- `Float` : 不動小数点 → number
- `Boolean` : 真偽 → boolean
- `ID` : ユニークな識別子 → string

基本型は全て Nullable。  
Nullを許容しない場合は末尾に `!`  ( eg. String! )  
リスト型の場合は `[]` で囲む ( eg. [String] )  

```ts
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    quoteOfTheDay: String
    random: Float!
    rollThreeDice: [Int]
  }
`);

const root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? 'Take it easy' : 'Salvation lies within';
  },
  random: () => {
    return Math.random();
  },
  rollThreeDice: () => {
    return [1, 2, 3].map((_) => 1 + Math.floor(Math.random() * 6));
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
```