import { Server, ServerCredentials } from "@grpc/grpc-js";
import { UsersService } from "../proto/users_grpc_pb";
import { UsersServer } from "./services";

const server = new Server();

const port = "3000";
const uri = `localhost:${port}`;
console.log(`Listening on ${uri}`);
server.bindAsync(uri, ServerCredentials.createInsecure(), (err, port) => {
  server.start();
  if (err) {
    server.tryShutdown(() => undefined);
  }
  server.addService(UsersService, new UsersServer() as any);
});
