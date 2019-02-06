/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */

import express from "express";
import { TreeRouter } from "./resources/tree";
import { errorHandler } from "./modules/errorHandler";

export const router = express.Router();
router.use("/tree", TreeRouter);
router.use(errorHandler);
