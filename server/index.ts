import * as grpc from "@grpc/grpc-js";
import { authProto, authServiceHandlers } from "./src/auth";
import { mathProto, mathServiceHandlers } from "./src/math";
import { serverHandlers, serverProto } from "./src/server";

const main = () => {
  const server = new grpc.Server();
  server.addService(mathProto.math.MathService.service, mathServiceHandlers);
  server.addService(serverProto.server.Server.service, serverHandlers);
  server.addService(authProto.auth.AuthService.service, authServiceHandlers);
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
