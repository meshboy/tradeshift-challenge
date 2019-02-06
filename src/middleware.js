/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */

import bodyparser from "body-parser";

const middleware = app => {
  app.use(bodyparser.urlencoded({ extended: true }));
  app.use(bodyparser.json());
};

export default middleware;
