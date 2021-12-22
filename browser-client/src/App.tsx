import React from "react";
import logo from "./logo.svg";
import "./App.css";
import { ServerClient } from "./proto/ServerServiceClientPb";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import { PingRs } from "./proto/server_pb";
import { ClientReadableStream } from "grpc-web";

function App() {
  React.useEffect(() => {
    const client = new ServerClient("http://localhost:8080");

    const empty = new Empty();

    const stream = client.ping(empty) as ClientReadableStream<PingRs>;

    stream.on("data", (response) => {
      console.log(response.toObject());
    });

    stream.on("end", () => {
      console.log("response ended");
    });

    stream.on("error", (err) => {
      console.error(err);
    });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
