import React from "react";
import { Empty } from "google-protobuf/google/protobuf/empty_pb";
import logo from "./logo.svg";
import { Counter } from "./features/counter/Counter";
import "./App.css";
import { UsersClient } from "./proto/users_grpc_pb";
import { credentials } from "@grpc/grpc-js";
import { User } from "./proto/users_pb.js";

function App() {
  React.useEffect(() => {
    const client = new UsersClient(
      "localhost:3001",
      credentials.createInsecure()
    );
    const stream = client.getUsers(new Empty());
    const users: User[] = [];
    stream.on("data", (user) => users.push(user));
    stream.on("error", () => console.error("ERROR!", users));
    stream.on("end", () => console.log("END", users));
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <Counter />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <span>
          <span>Learn </span>
          <a
            className="App-link"
            href="https://reactjs.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux
          </a>
          <span>, </span>
          <a
            className="App-link"
            href="https://redux-toolkit.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Redux Toolkit
          </a>
          ,<span> and </span>
          <a
            className="App-link"
            href="https://react-redux.js.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            React Redux
          </a>
        </span>
      </header>
    </div>
  );
}

export default App;
