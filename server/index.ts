import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { MathServiceHandlers } from "./proto/math/MathService";
import { ProtoGrpcType as ServerProtoGrpcType } from "./proto/server";
import { ProtoGrpcType as MathProtoGrpcType } from "./proto/math";
import { ServerHandlers } from "./proto/server/Server";

const getProto = <T>(filename: string) => {
  const serverPackageDefinition = protoLoader.loadSync(filename);
  return grpc.loadPackageDefinition(serverPackageDefinition) as unknown as T;
};

const serverProto: ServerProtoGrpcType = getProto("../proto/server.proto");
const mathProto: MathProtoGrpcType = getProto("../proto/math.proto");

const mathServiceHandlers: MathServiceHandlers = {
  pow: ({ request: { base = 0, exponent = 0 } }, res) => {
    const result = Math.pow(base, exponent);
    res(null, { result });
  },
};

const serverHandlers: ServerHandlers = {
  Ping: (call) => {
    let counter = 0;

    const timeoutImpl = () => {
      counter += 1;
      const random = Math.floor(Math.random() * counter);
      call.write({
        counter,
        random: random,
      });

      if (counter > 66) {
        call.end();
      } else {
        setTimeout(timeoutImpl, 10 * random);
      }
    };

    setTimeout(timeoutImpl);
  },
};

const main = () => {
  const server = new grpc.Server();
  server.addService(mathProto.math.MathService.service, mathServiceHandlers);
  server.addService(serverProto.server.Server.service, serverHandlers);
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
