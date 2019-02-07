/**
 * created by Meshileya Seun <meshileyaseun@gmail.com/>
 */
import chai, { expect } from "chai";
import chaiHttp from "chai-http";
import app from "../../../server";
import status from "../../network/status";

import mongoose from "mongoose";
mongoose.Promise = global.Promise;

chai.use(chaiHttp);

const connect = () =>
  mongoose.connect(process.env.TEST_MONGO_URI, { useMongoClient: true });

const dropDb = () => {
  return new Promise((resolve, reject) => {
    const c = mongoose.connection.dropDatabase();
    resolve(c);
  });
};

describe("Tree", () => {
  const rootNode = "organisation";

  beforeEach(async () => {
    connect();
  });

  beforeEach(async () => {
    const rootResource = {
      node: rootNode
    };

    const createRootNode = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(rootResource);

    expect(createRootNode).to.have.status(status.CREATED);
  });

  afterEach(async () => {
    await dropDb();
  });

  it("should create a node under root node", async () => {
    const resource = {
      node: "ceo"
    };

    const result = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(resource);

    expect(result).to.have.status(status.CREATED);
    expect(result).to.be.json;
    expect(result.body.data.node).to.eql(resource.node);
    expect(result.body.data.parent).to.exist;
    expect(result.body.data.parent).to.eql(rootNode);
  });

  it("should create new node under root node", async () => {
    const resource = {
      node: "coo"
    };

    const result = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(resource);

    expect(result).to.have.status(status.CREATED);
    expect(result).to.be.json;
    expect(result.body.data.node).to.eql(resource.node);
    expect(result.body.data.parent).to.exist;
    expect(result.body.data.parent).to.eql(rootNode);
  });

  it("should get descendants of a node", async () => {
    const createNodeResource = {
      node: "coo"
    };

    const createdNodeResult = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(createNodeResource);

    expect(createdNodeResult).to.have.status(status.CREATED);

    const result = await chai.request(app).get(`/api/v1/tree/${rootNode}`);

    expect(result).to.have.status(status.OK);
    expect(result).to.be.json;
    expect(result.body.data.parent).to.exist;
    expect(result.body.data.parent.root).to.eql(rootNode);
    expect(result.body.data.children).to.be.an("array");
    expect(result.body.data.children).to.have.length(1);
    expect(result.body.data.children[0].node).to.eql(createNodeResource.node);
  });

  it("should change the parent of a node", async () => {
    const resourceOne = {
      node: "cto"
    };

    const promiseOne = chai
      .request(app)
      .post("/api/v1/tree")
      .send(resourceOne);

    const resourceTwo = {
      node: "developer"
    };

    const promiseTwo = chai
      .request(app)
      .post("/api/v1/tree")
      .send(resourceTwo);

    const [resultOne, resultTwo] = await Promise.all([promiseOne, promiseTwo]);

    const updateParent = {
      node: resourceTwo.node,
      parent: resourceOne.node
    };

    expect(resultOne).to.have.status(status.CREATED);
    expect(resultTwo).to.have.status(status.CREATED);

    const updateParentResult = await chai
      .request(app)
      .put("/api/v1/tree")
      .send(updateParent);

    expect(updateParentResult).to.have.status(status.OK);
    expect(updateParentResult).to.be.json;
    expect(updateParentResult.body.data.root).to.eql(rootNode);
    expect(updateParentResult.body.data.parent).to.exist;
    expect(updateParentResult.body.data.children).to.be.an("array");
    expect(updateParentResult.body.data.children.indexOf(resourceTwo)).to.exist;
  });
});
