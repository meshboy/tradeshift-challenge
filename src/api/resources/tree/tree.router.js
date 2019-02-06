/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import express from "express";
import TreeController from "./tree.controller";

export const TreeRouter = express.Router();

TreeRouter.route("/").post(TreeController.createNode);

TreeRouter.route("/:node").get(TreeController.getDecendants);
