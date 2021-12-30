import path from 'path';
import {ProtoGrpcType} from "../proto/server";
import {ServerHandlers} from "../proto/server/Server";
import getProto from "./getProto";

export const serverProto: ProtoGrpcType = getProto(
  path.join(__dirname, "../../proto/server.proto")
);

export const serverHandlers: ServerHandlers = {
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
