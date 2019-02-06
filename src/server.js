/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */

import express from "express";
import { connect } from "./db";
import middleware from "./middleware";
import { router } from "./api/router";
import { errorHandler } from "./api/modules/errorHandler";

const app = express();

middleware(app);
connect();

app.use("/api/v1/", router);
app.use(errorHandler);
export default app;
