import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/server";
import { ServerHandlers } from "./proto/server/Server";

const serverPackageDefinition = protoLoader.loadSync("./proto/server.proto");
const proto = grpc.loadPackageDefinition(
  serverPackageDefinition
) as unknown as ProtoGrpcType;

let counter = 0;

const serverHandlers: ServerHandlers = {
  Ping: (call) => {
    setInterval(() => {
      counter += 1;
      call.write({
        counter,
        delay: Math.floor(Math.random() * counter),
      });
    }, 1500);
  },
};

const main = () => {
  const server = new grpc.Server();
  server.addService(proto.server.Server.service, serverHandlers);
  server.bindAsync(
    "localhost:1987",
    grpc.ServerCredentials.createInsecure(),
    (err, port) => {
      if (err) {
        console.error(err);
        server.tryShutdown((err) => {
          console.error(err);
        });
        return;
      }

      console.log(`Server started on port ${port}.`);
      server.start();
    }
  );
};

main();
