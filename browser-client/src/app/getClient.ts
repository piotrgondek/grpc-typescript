import { ServerClient } from "../proto/ServerServiceClientPb";

/**
 * @deprecated not sure if it's ok
 */
const getClient = () => new ServerClient("http://localhost:8080");

export default getClient;
