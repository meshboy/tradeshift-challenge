/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */

import http from "http";
import app from "./server";

const server = http.createServer(app);
let currentApp = app;

const portNumber = process.env.PORT_NUMBER;

server.listen(portNumber, () => {
  console.log(`Server listening on port ${portNumber}`);
});

if (module.hot) {
  module.hot.accept(["./server"], () => {
    server.removeListener("request", currentApp);
    server.on("request", app);
    currentApp = app;
  });
}
