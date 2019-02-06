/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import status from "../network/status";

export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);
  res
    .status(status.FORBIDDEN)
    .json({
      status: false,
      message: error.toString() || "Internal server error"
    });
};
