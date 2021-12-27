import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { pingRsSelectors, useGetPingsQuery } from "./services/pingAPI";
import Pow from "./features/pow/Pow";

function App() {
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
    <div className="App">
      <header className="App-header">
        <div>
          <Pow />
        </div>
        <img src={logo} className="App-logo" alt="logo" />
        <button className="button" type="button" onClick={increaseCounter}>
          More
        </button>
        <pre>Ids: {JSON.stringify(ids)}</pre>
        <pre>Response: {JSON.stringify(latestEntity)}</pre>
      </header>
    </div>
  );
}

export default App;
