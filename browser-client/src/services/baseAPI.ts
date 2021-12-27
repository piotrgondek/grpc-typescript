import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

const baseAPI = createApi({
  baseQuery: fakeBaseQuery(),
  tagTypes: ["POW"],
  endpoints: () => ({}),
});

export default baseAPI;
