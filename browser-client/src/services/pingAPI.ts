import { createEntityAdapter, EntityState } from "@reduxjs/toolkit";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { ClientReadableStream } from "grpc-web";
import getClient from "../app/getClient";
import { PingRs } from "../proto/server_pb";
import baseAPI from "./baseAPI";

const pingRsAdapter = createEntityAdapter<PingRs.AsObject>({
  selectId: (model) => model.counter,
});

export const pingApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPings: builder.query<EntityState<PingRs.AsObject>, number>({
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
          updateCachedData((draft) => {
            pingRsAdapter.upsertOne(draft, res);
          });
        });
      },
    }),
  }),
});

export const { useGetPingsQuery } = pingApi;
export const pingRsSelectors = pingRsAdapter.getSelectors();
