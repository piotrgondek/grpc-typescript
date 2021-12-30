import { ServerErrorResponse, ServerWritableStream } from "@grpc/grpc-js";
import { ProtoGrpcType } from "../proto/auth";
import { AuthServiceHandlers } from "../proto/auth/AuthService";
import { Status } from "../proto/auth/Status";
import { VerifyRq__Output } from "../proto/auth/VerifyRq";
import { VerifyRs } from "../proto/auth/VerifyRs";
import getProto from "./getProto";
import path from "path";

export const authProto: ProtoGrpcType = getProto(
  path.join(__dirname, "../../proto/auth.proto")
);

const users = new Set<{ login?: string; passwd?: string }>();
users.add({ login: "piogon", passwd: "changeme" });

type Token = `token:${number}`;

const sessions = new Map<Token, Status>();

const calls = new Map<
  Token,
  Pick<ServerWritableStream<VerifyRq__Output, VerifyRs>, "write" | "end">
>();

export const authServiceHandlers: AuthServiceHandlers = {
  signin: (call, callback) => {
    const { login, passwd } = call.request;
    const isSigin = !!Array.from(users.values()).filter(
      (user) => user.login === login && user.passwd === passwd
    ).length;

    console.log({ isSigin });

    if (isSigin) {
      const token: Token = `token:${new Date().getTime()}`;
      console.log({ token });
      sessions.set(token, Status.SIGN_IN);
      callback(null, { token });
    } else {
      const err: ServerErrorResponse = {
        name: "err",
        message: "user not found",
      };
      console.error({ err });
      callback(err);
    }
  },
  signout: (call, callback) => {
    const token = call.request.token as Token | undefined;
    if (token && sessions.has(token)) {
      const status = Status.SIGN_OUT;
      sessions.set(token, status);
      const call = calls.get(token);
      if (call) {
        call.write({ status });
        setTimeout(() => {
          call.end();
        }, 5000);
      }
    }

    callback(null);
  },
  verify: (call) => {
    const token = call.request.token as Token | undefined;
    console.log({ token });
    if (token) {
      const status = sessions.get(token);
      console.log({ status });
      calls.set(token, call);
      call.write({ status });
    } else {
      call.end();
    }
  },
};
