/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import Joi from "joi";
import status from "../../network/status";
import { generateControllers } from "../../modules/query";
import { Tree } from "./tree.model";

/**
 * create a node in a tree
 * @param {*} req
 * @param {*} res
 * @param {*} next
 *
 * creating in a node in a Tree, there is a check to know
 *  if its a root node or a child of the root, if its a root
 * its added as a node. if a root is not found, then we have our first root
 * a node is expected to contain unique children, a duplicate of node in its children
 * is prevented
 */
const createNode = (req, res, next) => {
  const node = req.body.node;

  const schema = Joi.object().keys({
    node: Joi.string().required()
  });

  const validation = Joi.validate({ node }, schema);

  if (validation.error) {
    return res
      .status(status.BAD_REQUEST)
      .json({ status: false, message: validation.error });
  }

  //   check if the node already exist in the tree
  Tree.findOne({ node })
    .then(existingDoc => {
      if (existingDoc) {
        throw new Error(`Node ${node} already exist in tree`);
      } else {
        //   get the first node (root) in the tree
        Tree.findOne({})
          .sort({ _id: 1 })
          .limit(1)
          .then(lastDoc => {
            //   if the root exist, the root is the new parent of the new created node
            const parent = lastDoc ? lastDoc.node : node;
            const root = parent;
            Tree.create({ node, parent, root })
              .then(newDoc => {
                if (lastDoc) {
                  // the new created node is the child of the root
                  if (lastDoc.node != newDoc.node) {
                    Tree.findOneAndUpdate(
                      { node: lastDoc.node },
                      { $addToSet: { children: newDoc.node } },
                      { new: true }
                    )
                      .exec()
                      .then(updateDoc => {
                        res.status(status.CREATED).json({
                          status: true,
                          data: Object.assign(newDoc, {
                            parent: updateDoc.parent,
                            root: updateDoc.root
                          })
                        }); //response update with the newly created node
                      })
                      .catch(error => next(error));
                  } else {
                    res
                      .status(status.CREATED)
                      .json({ status: true, data: newDoc });
                  }
                } else {
                  res
                    .status(status.CREATED)
                    .json({ status: true, data: newDoc });
                }
              })
              .catch(error => next(error));
          });
      }
    })
    .catch(error => next(error));
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * update the parent of any node in the tree by adding the node to the
 * new parent and pulling out the node from the existing parent
 */
const updateParent = (req, res, next) => {
  const parent = req.body.parent;
  const node = req.body.node;

  const schema = Joi.object().keys({
    node: Joi.string().required(),
    parent: Joi.string().required()
  });

  const validation = Joi.validate({ node, parent }, schema);

  if (validation.error) {
    return res
      .status(status.BAD_REQUEST)
      .json({ status: false, message: validation.error });
  }

  //   add the node to the new parent
  Tree.findOneAndUpdate(
    { node: parent },
    { $addToSet: { children: node } },
    { new: true }
  )
    .exec()
    .then(updatedDoc => {
      if (updatedDoc) {
        // find the node in the tree and pull it out of its old parent
        Tree.findOne({ node })
          .then(nodeDoc => {
            Tree.findOneAndUpdate(
              { node: nodeDoc.parent },
              { $pull: { children: node } },
              { new: true }
            )
              .exec()
              .then(removeDoc => {
                res.status(status.OK).json({ status: true, updatedDoc });
              });
          })
          .catch(error => next(error));
      } else {
        res
          .status(status.NOT_FOUND)
          .json({ status: false, message: "Node is not found" });
      }
    })
    .catch(error => next(error));
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * Get all children of a given node
 */
const getDecendants = (req, res, next) => {
  const node = req.params.node;
  Tree.findOne({ node }).then(doc => {
    if (doc) {
      Tree.find({ node: { $in: doc.children } }).then(docArray => {
        //   delete doc children to enhance response
        delete doc.children;

        // bind the children to her parents
        const doc_ = { parent: doc, children: docArray };
        res.status(status.OK).json({
          status: true,
          data: doc_
        });
      });
    } else {
      res
        .status(status.NOT_FOUND)
        .json({ status: false, message: "Node is not found" });
    }
  });
};

export default generateControllers(Tree, {
  createNode,
  updateParent,
  getDecendants
});
