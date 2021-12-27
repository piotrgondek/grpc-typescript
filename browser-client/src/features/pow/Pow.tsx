import React from "react";
import { useAppDispatch } from "../../app/hooks";
import { PowRq } from "../../proto/math_pb";
import { mathApi, useGetPowQuery } from "../../services/mathAPI";

const initialState: PowRq.AsObject = {
  base: 0,
  exponent: 0,
};

const Pow: React.FC = () => {
  const [powRq, setPowRq] = React.useState<PowRq.AsObject>(initialState);
  const { data } = useGetPowQuery(powRq);
  const dispatch = useAppDispatch();

  const onBaseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPowRq((prev) => ({
      ...prev,
      base: Number(e.target.value),
    }));
  };

  const onExponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPowRq((prev) => ({
      ...prev,
      exponent: Number(e.target.value),
    }));
  };

  const resetAllTags = () => {
    dispatch(mathApi.util.invalidateTags(["POW"]));
  };

  return (
    <div>
      {data && <h4>{data.result}</h4>}
      <input type="number" value={powRq.base} onChange={onBaseChange} />
      <input type="number" value={powRq.exponent} onChange={onExponentChange} />
      <button
        type="button"
        onClick={() => {
          dispatch(
            mathApi.util.invalidateTags([{ type: "POW", id: data!.result }])
          );
        }}
      >
        Reset this
      </button>
      <button type="button" onClick={resetAllTags}>
        Reset all!
      </button>
    </div>
  );
};

export default Pow;
