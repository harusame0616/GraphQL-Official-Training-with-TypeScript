import { graphql, buildSchema } from 'graphql';

// クエリのスキーマを作成
var schema = buildSchema(`
  type Query {
    hello: String
  }
`);

// クエリを処理するリゾルバを定義
var rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

const main = async () => {
  // クエリを実行
  const response = await graphql({
    schema,
    source: '{ hello }', //
    rootValue,
  });

  console.log(response);
};

main();
