# Object Type

## インストールと実行

```sh
npm i && npm start
```
## 説明

データの挿入やデータの変更などを行うAPIでは Query ではなく Mutation として定義する必要があります。

メッセージの更新と取得するAPIのスキーマ

```graphql
type Mutation {
  setMessage(message: String): String
}

type Query {
  getMessage(message: String): String
}
```

メッセージの更新と取得するAPIの実装例

```ts
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
type Mutation {
    setMessage(message:String!): String!
}

type Query {
  getMessage: String!
}
`);

const inmemoryDB = {
  message: 'default',
};

const root = {
  setMessage: ({ message }: { message: string }) => {
    inmemoryDB.message = message;

    return inmemoryDB.message;
  },
  getMessage: () => {
    return inmemoryDB.message;
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

初期メッセージ取得

```graphql
{
	getMessage
}
```

⇨ ‘default’

メッセージ更新

```graphql
mutation {
	setMessage(message: "hello")
}
```

⇨ ’hello’

更新後メッセージ取得

```graphql
{
	getMessage
}
```

⇨ ‘hello’

また、同じ入力パラメータを複数のAPIで使う時などは input キーワードを使って入力型としてまとめることができます。

```graphql
input MessageInput {
  content: String
  author: String
}

type Message {
  id: ID!
  content: String
  author: String
}

type Query {
  getMessage(id: ID!): Message
}

type Mutation {
  createMessage(input: MessageInput): Message
  updateMessage(id: ID!, input: MessageInput): Message
}
```

入力タイプはフィールドとして、基本型、リスト型、入力型のみを持つことができます。
オブジェクト型を持つことはできません。

```ts
import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';
import crypto from 'crypto';

const schema = buildSchema(`
  input MessageInput {
    content: String
    author: String
  }

  type Message {
    id: ID!
    content: String
    author: String
  }

  type Query {
    getMessage(id: ID!): Message
  }

  type Mutation {
    createMessage(input: MessageInput): Message
    updateMessage(id: ID!, input: MessageInput): Message
  }
`);

interface MessageInput {
  content: string;
  author: string;
}

class Message {
  private _content: string;
  private _author: string;
  constructor(private _id: string, { content, author }: MessageInput) {
    this._content = content;
    this._author = author;
  }

  get id() {
    return this._id;
  }

  get content() {
    return this._content;
  }
  get author() {
    return this._author;
  }
}

type MessageInfo = {
  content: string;
  author: string;
};

const inmemoryDB: {
  [key: string]: MessageInfo;
} = {};

const root = {
  getMessage: ({ id }: { id: string }) => {
    if (!inmemoryDB[id]) {
      throw new Error('no message exists with id ' + id);
    }

    return new Message(id, inmemoryDB[id]);
  },
  createMessage: ({ input }: { input: MessageInfo }) => {
    const id = crypto.randomUUID();

    inmemoryDB[id] = input;
    return new Message(id, input);
  },
  updateMessage: ({ id, input }: { id: string; input: MessageInput }) => {
    if (!inmemoryDB[id]) {
      throw new Error('no message exists with id ' + id);
    }

    inmemoryDB[id] = input;
    return new Message(id, input);
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

app.listen(4001, () => {
  console.log('Running a GraphQL API server2 at localhost:4001/graphql');
});
```