import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ServerClient } from "./proto/ServerServiceClientPb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { PingRs } from "./proto/server_pb";
import { ClientReadableStream, RpcError, Status } from "grpc-web";

function App() {
  const [response, setResponse] = React.useState<PingRs.AsObject | {}>({});
  const [status, setStatus] = React.useState<Status | void>();
  const [error, setError] = React.useState<RpcError | void>();
  const [isFinished, setIsFinished] = React.useState<boolean>(false);
  const [timestamp, setTimestamp] = React.useState<number>(() =>
    new Date().getTime()
  );

  React.useEffect(() => {
    const client = new ServerClient("http://localhost:8080");

    const empty = new Empty();

    const stream = client.ping(empty) as ClientReadableStream<PingRs>;

    stream.on("data", (response) => {
      console.log("Response:", response.toObject());
      setResponse(response.toObject());
    });

    stream.on("status", (status) => {
      console.log({ status });
      setStatus(status);
    });

    stream.on("end", () => {
      console.log("response ended");
      setIsFinished(true);
    });

    stream.on("error", (err) => {
      console.error(err);
      setError(err);
    });
  }, [timestamp]);

  const doAgain = () => {
    setResponse({});
    setStatus();
    setError();
    setIsFinished(false);
    setTimestamp(new Date().getTime());
  };

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {isFinished && (
          <>
            <h3>Stream is ended!</h3>
            <button className="button" type="button" onClick={doAgain}>
              Again!
            </button>
          </>
        )}
        <pre>Response: {JSON.stringify(response)}</pre>
        {status && <pre>Status: {JSON.stringify(status)}</pre>}
        {error && <pre>Error: {JSON.stringify(error.message)}</pre>}
      </header>
    </div>
  );
}

export default App;
