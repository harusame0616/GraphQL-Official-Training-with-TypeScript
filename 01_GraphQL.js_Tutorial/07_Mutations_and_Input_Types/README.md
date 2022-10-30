# Mutation and Input types

## インストールと実行

```sh
npm i && npm start
```

opne http://localhost:4000/graphql or http://localhost:4001/graphql in your browser.


## 説明

express-graphqlと組み合わせて、Expressミドルウェアを簡単に利用できます。

また、リゾルバでは第２引数からrequestにアクセスすることができます。

```tsx
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

var schema = buildSchema(`
  type Query {
    ip: String
  }
`);

const loggingMiddleware = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  console.log('ip:', req.ip);
  next();
};

const root = {
  ip: (_args: any, context: express.Request) => {
    // graphqlHTTP の context オプションを指定していないので 第二引数には express.Request の値が渡される
    return context.ip;
  },
};

const app = express();
app.use(loggingMiddleware);
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
    // context: { hoge: 'context' }, // resolver の第二引数に渡す値。指定しないと requestオブジェクトが渡される。
  })
);

app.listen(4000);
console.log('Running a GraphQL API server at localhost:4000/graphql');
```