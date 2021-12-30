import path from 'path';
import {ProtoGrpcType} from "../proto/math";
import {MathServiceHandlers} from "../proto/math/MathService";
import getProto from "./getProto";

export const mathProto: ProtoGrpcType = getProto(
  path.join(__dirname, "../../proto/math.proto")
);

export const mathServiceHandlers: MathServiceHandlers = {
  pow: ({ request: { base = 0, exponent = 0 } }, res) => {
    const result = Math.pow(base, exponent);
    res(null, { result });
  },
};
