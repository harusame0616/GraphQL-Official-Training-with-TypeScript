# GraphQL Client

## install and start

```sh
npm i && npx start
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