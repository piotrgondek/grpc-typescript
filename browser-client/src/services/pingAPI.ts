import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { ClientReadableStream } from "grpc-web";
import getClient from "../app/getClient";
import { PingRs } from "../proto/server_pb";

type PingRsObj = ReturnType<typeof PingRs.toObject>;

const pingRsAdapter = createEntityAdapter<PingRsObj>({
  selectId: (model) => model.counter,
});

export const pingApi = createApi({
  reducerPath: "pingApi",
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPings: builder.query<EntityState<PingRsObj>, number>({
      queryFn: () => ({
        data: {
          ids: [],
          entities: {},
        },
      }),
      onCacheEntryAdded: async (_, { updateCachedData }) => {
        const client = getClient();
        const stream = client.ping(new Empty()) as ClientReadableStream<PingRs>;

        stream.on("data", (response) => {
          const res = response.toObject();
          console.log("Response:", res);
          updateCachedData((draft) => {
            pingRsAdapter.upsertOne(draft, res);
          });
        });

        stream.on("end", () => {
          console.log("response ended");
        });
      },
    }),
  }),
});

export const { useGetPingsQuery } = pingApi;
export const pingRsSelectors = pingRsAdapter.getSelectors();
