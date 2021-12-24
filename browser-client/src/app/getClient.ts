import { ServerClient } from "../proto/ServerServiceClientPb";

const getClient = () => new ServerClient("http://localhost:8080");

export default getClient;
