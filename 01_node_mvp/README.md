# gRPC in the node

This is MVP of gRPC with TS in Node env. There is implemented a very
strate forward communication between `client` and `server`.

## Setup

```sh
npm i
npm run build
```

For Apple M1

```sh
npm i --target_arch=x64
npm run build
```

`build` script will generate JS and TS files inside `proto/` directory. As input
it takes `proto/users.proto`.

## Run server

`npm run server`

## Run client

`npm run client`

This script will make 3 requests: both for reading and writing users.
