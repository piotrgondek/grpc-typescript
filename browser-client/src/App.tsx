import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Pow from "./features/pow/Pow";
import { useAppSelector } from "./app/hooks";
import { selectToken } from "./features/auth/authSlice";
import {
  useSigninMutation,
  useSignoutMutation,
  useVerifyQuery,
} from "./services/authAPI";
import { skipToken } from "@reduxjs/toolkit/query";
import { Status } from "./proto/auth_pb";

const statuses = Object.keys(Status);

console.log({ statuses });

const App: React.FC = () => {
  const [signin] = useSigninMutation();
  const [signout] = useSignoutMutation();
  const token = useAppSelector(selectToken);
  const { data } = useVerifyQuery(token ?? skipToken);
  const [login, setLogin] = React.useState<string>("");
  const [passwd, setPasswd] = React.useState<string>("");

  if (!token) {
    return (
      <>
        <h1>No token!</h1>
        <div>
          Login:{" "}
          <input
            value={login}
            onChange={(e) => {
              setLogin(e.target.value);
            }}
          />
        </div>
        <div>
          Passwd:
          <input
            value={passwd}
            onChange={(e) => {
              setPasswd(e.target.value);
            }}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            console.log({ login, passwd });
            signin({ login, passwd });
          }}
        >
          Log in
        </button>
      </>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {data && <h3>You're {statuses[data.status]}</h3>}
        <img src={logo} className="App-logo" alt="logo" />
        <button
          type="button"
          onClick={() => {
            signout({ token });
          }}
        >
          LOG OUT
        </button>
        <Pow />
      </header>
    </div>
  );
};

export default App;
