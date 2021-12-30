import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const getProto = <T>(filename: string) => {
  const serverPackageDefinition = protoLoader.loadSync(filename);
  return grpc.loadPackageDefinition(serverPackageDefinition) as unknown as T;
};

export default getProto;
