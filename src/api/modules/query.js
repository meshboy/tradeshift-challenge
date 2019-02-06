/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import status from "../network/status";
/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */

// export const controllers = {
//   createOne(model, body) {
//     return model.create(body);
//   }
// };

// export const createOne = model => (req, res, next) =>
//   controllers
//     .createOne(model, req.body)
//     .then(doc => res.status(status.CREATED).json(doc))
//     .catch(error => next(error));

export const generateControllers = (model, overrides = {}) => {
  const defaults = {
    // createOne: createOne(model)
  };

  return { ...defaults, ...overrides };
};
