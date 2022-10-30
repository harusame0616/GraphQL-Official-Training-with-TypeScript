# GraphQL Client

## インストールと実行

```sh
npm i && npm start
```

## Client

1. curl
```sh
 curl -X POST -H "Content-Type: application/json" -d '{"query":"{ hello }"}' http://localhost:4000/graphql
 ```

2. Postman  
POST localhost:4000/graphql 
Body : GraphQL
```
{
  hello
}
```

3. javascript (Passing Arguments) . 
Sample html is in public/index.html  
opne http://localhost:4000/ in your browser.

## 説明

GraphQL クライアントライブラリも存在しますが、単純な HTTP の POSTリクエストによって簡単にクエリを発行することができます。

REST APIでは用途によって GET/DELETE/POST/PUT などを使い分けますが、GraphQL では POSTを使ってクエリを発行します。

Express GraphQL Server で作成したGraphQLサーバーに対して以下のようなcurlコマンドを実行するとJSON形式でデータが返却されます。

```sh
curl -X POST -H "Content-Type: Application/json" -d '{"Query": "{hello}"}' http://localhost:4000/graphql
```

また、GraphQL でも API のエンドポイントに引数を渡すことができます。

queryに$をプレフィックスとしたキーワードを指定し、variablesでキーワードに対応したメンバ変数を持つオブジェクト渡すことで値を自動的にエスケープしてクエリを発行できます。

```ts
const dice = 3;
const sides = 7;
      
// dice と sides を変数として渡すために 
// $dice と $sides を指定してクエリを作成する。
const query = `query RollDice($dice: Int!, $sides: Int) {
    rollDice(numDice: $dice, numSides: $sides)
}`;

const result = await fetch("/graphql2", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({
    query,
    variables: { dice, sides }, // dice と sides を含むオブジェクトを渡す
  }),
});
```