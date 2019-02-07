/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import mongoose, { mongo } from "mongoose";

const treeSchema = new mongoose.Schema(
  {
    node: {
      type: String,
      required: [true, "Every tree must have a node. Node is required"],
      unique: true,
      lowercase: true
    },
    children: [
      {
        type: String,
        lowercase: true,
        index: true
      }
    ],
    parent: {
      type: String,
      lowercase: true
    },
    root: { 
      type: String,
      lowercase: true
    }
  },
  { timestamps: true }
);

export const Tree = mongoose.model("Tree", treeSchema);
