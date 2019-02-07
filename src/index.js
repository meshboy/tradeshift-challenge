/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */

import http from "http";
import app from "./server";

const server = http.createServer(app);

require('dotenv').config()

const portNumber = process.env.PORT_NUMBER;

server.listen(portNumber, () => {
  console.log(`Server listening on port ${portNumber}`);
});