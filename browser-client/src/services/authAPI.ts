import { AuthServiceClient } from "../proto/AuthServiceClientPb";
import {
  SigninRq,
  SigninRs,
  SignoutRq,
  Status,
  VerifyRq,
  VerifyRs,
} from "../proto/auth_pb";
import baseAPI from "./baseAPI";
import { clearToken, setToken, Token } from "../features/auth/authSlice";
import { ClientReadableStream } from "grpc-web";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";

const getClient = () => new AuthServiceClient("http://localhost:8080");

export const authApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    verify: builder.query<VerifyRs.AsObject, Token>({
      queryFn: () => ({ data: { status: Status.VERIFYING } }),
      onCacheEntryAdded: async (token, { updateCachedData, dispatch }) => {
        const client = getClient();
        const verifyRq = new VerifyRq();
        verifyRq.setToken(token);
        const stream = client.verify(
          verifyRq
        ) as ClientReadableStream<VerifyRs>;

        stream.on("data", (rawRs) => {
          const { status } = rawRs.toObject();
          console.log("status received", { status });
          updateCachedData((draft) => {
            draft.status = status;
          });
        });

        stream.on("end", () => {
          console.warn("stream ended");
          dispatch(clearToken());
        });
      },
    }),
    signout: builder.mutation<Empty.AsObject, SignoutRq.AsObject>({
      queryFn: async ({ token }) => {
        const client = getClient();
        const signoutRq = new SignoutRq();
        signoutRq.setToken(token);
        const signoutRs = await client.signout(signoutRq, null);
        return {
          data: signoutRs.toObject(),
        };
      },
    }),
    signin: builder.mutation<SigninRs.AsObject, SigninRq.AsObject>({
      queryFn: async ({ login, passwd }) => {
        const client = getClient();
        const signinRq = new SigninRq();
        signinRq.setLogin(login);
        signinRq.setPasswd(passwd);

        try {
          const signinRs = await client.signin(signinRq, null);

          const { token } = signinRs.toObject();

          return {
            data: {
              token,
            },
          };
        } catch (e: any) {
          return {
            error: e.message,
          };
        }
      },
      onCacheEntryAdded: async (
        _,
        { getCacheEntry, dispatch, cacheDataLoaded }
      ) => {
        await cacheDataLoaded;
        const { data } = getCacheEntry();

        if (data) {
          const token = data.token as Token;
          dispatch(setToken(token));
        }
      },
    }),
  }),
});

export const { useSigninMutation, useVerifyQuery, useSignoutMutation } =
  authApi;
