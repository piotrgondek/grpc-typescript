import React from "react";
import { pingRsSelectors, useGetPingsQuery } from "../../services/pingAPI";

const Ping: React.FC = () => {
  const [counter, setCounter] = React.useState<number>(0);
  const { data } = useGetPingsQuery(counter);

  const { ids, latestEntity } = data
    ? {
        ids: pingRsSelectors.selectIds(data),
        latestEntity: pingRsSelectors.selectById(
          data,
          data.ids[data.ids.length - 1]
        ),
      }
    : {
        ids: [],
        latestEntity: undefined,
      };

  const increaseCounter = () => {
    setCounter((counter + 1) % 4);
  };

  return (
    <>
      <button className="button" type="button" onClick={increaseCounter}>
        More
      </button>
      <pre>Ids: {JSON.stringify(ids)}</pre>
      <pre>Response: {JSON.stringify(latestEntity)}</pre>
    </>
  );
};

export default Ping;
