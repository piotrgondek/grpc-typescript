import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import { ProtoGrpcType } from "./proto/server";
import { PingRs } from "./proto/server/PingRs";
import { ServerClient } from "./proto/server/Server";

const serverPackageDefinition = protoLoader.loadSync("../proto/server.proto");
const proto = grpc.loadPackageDefinition(
  serverPackageDefinition
) as unknown as ProtoGrpcType;

const pingServer = (client: ServerClient) => {
  const stream = client.Ping({});
  stream.on("data", (chunk: PingRs) => {
    console.log(chunk);
  });
};

const main = () => {
  const client = new proto.server.Server(
    "localhost:1987",
    grpc.credentials.createInsecure()
  );

  const deadline = new Date();
  deadline.setSeconds(deadline.getSeconds() + 5);
  client.waitForReady(deadline, (err) => {
    if (err) {
      console.error(err);
      return;
    }

    pingServer(client);
  });
};

main();
