# Getting Started

https://graphql.org/graphql-js/


## パッケージインストールと実行
```sh
npm i && npm start
```

## 説明

GraphQLを扱うには Query型で定義されたスキーマと、クエリに対応したResolverと呼ばれる関数の実装が必要。

Hello Worldを返すAPIの実装例。

```ts
import { graphql, buildSchema } from 'graphql';

// Query 型でスキーマを定義
// 文字列を返す hello という API を定義している
const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// クエリを処理するリゾルバを定義
const rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

const main = async () => {
  const query = '{ hello }';

  // クエリを実行
  const response = await graphql({
    schema,
    source: query,
    rootValue,
  });

  console.log(response);
};

main();
```

実行
```sh
npx ts-node server
```

> { data: [Object: null prototype] { hello: 'Hello world!' } }