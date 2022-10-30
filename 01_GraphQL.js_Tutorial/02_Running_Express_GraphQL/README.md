# Running Express + GraphQL

https://graphql.org/graphql-js/running-an-express-graphql-server/

## インストールと実行

```sh
npm i && npm start
```

## 説明

Express を使ってHTTPのエンドポイントにGraphQLサーバーをマウントできます。

パッケージ導入

```sh
npm init && npm i ts-node graphql express-graphql express @types/express
```

Express で httpエンドポイントへGraphQLサーバーをマッピングする実装例

```ts
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
```

graphqlサーバーを起動

```sh
npx ts-node server
```

ブラウザで以下のURLにアクセスすると WebUI で実行できる GraphiQL にアクセスできる。

> https://localhost:4000/graphql

画面の左側に以下のクエリを入力して実行すると結果が返ってくる。

```graphql
{
  hello
}
```
