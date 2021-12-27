import { MathServiceClient } from "../proto/MathServiceClientPb";
import { PowRq, PowRs } from "../proto/math_pb";
import baseAPI from "./baseAPI";

function getClient() {
  return new MathServiceClient("http://localhost:8080");
}

export const mathApi = baseAPI.injectEndpoints({
  endpoints: (builder) => ({
    getPow: builder.query<PowRs.AsObject, PowRq.AsObject>({
      providesTags: (result) => [{ type: "POW", id: `${result!.result}` }],
      queryFn: async (rq) => {
        const client = getClient();
        const powRq = new PowRq();
        powRq.setBase(rq.base);
        powRq.setExponent(rq.exponent);
        const powRs = await client.pow(powRq, null);
        const { result } = powRs.toObject();
        return { data: { result } };
      },
    }),
  }),
});

export const { useGetPowQuery } = mathApi;
