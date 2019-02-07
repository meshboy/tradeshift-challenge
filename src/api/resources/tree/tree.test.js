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
    mongoose.connection.dropDatabase();
  });
};

describe("Tree", () => {
  const rootNode = "organisation";

  beforeEach(async () => {
    connect();
  });

  afterEach(async () => {
    await dropDb();
  });

  it("should create a root node", async () => {
    const resource = {
      node: rootNode
    };

    const result = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(resource);

    expect(result).to.have.status(status.CREATED);
    expect(result).to.be.json;
    expect(result.body.data.node).to.eql(resource.node);
    expect(result.body.data.parent).to.exist;
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

  it("should get descendants of a node", async () => {
    const node = "organisation";

    const result = await chai.request(app).get(`/api/v1/tree/${node}`);

    console.log(result);

    expect(result).to.have.status(status.OK);
    expect(result).to.be.json;
    expect(result.body.data.root).to.eql(rootNode);
    expect(result.body.data.parent).to.exist;
    expect(result.body.data.children).to.be.an("array");
    expect(result.body.data.children).to.have.length(1);
  });

  it("should change the parent of a node", async () => {
    const resourceOne = {
      node: "cto"
    };

    const resultOne = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(resourceOne);

    const resourceTwo = {
      node: "developer"
    };

    const resultTwo = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(resourceTwo);

    const updateParent = {
      node: resourceTwo,
      parent: resourceOne
    };

    const updateParentResult = await chai
      .request(app)
      .post("/api/v1/tree")
      .send(updateParent);

    expect(resultOne).to.have.status(status.OK);

    expect(resultTwo).to.have.status(status.OK);

    expect(updateParentResult).to.have.status(status.OK);
    expect(result).to.be.json;
    expect(result.body.data.root).to.eql(rootNode);
    expect(result.body.data.parent).to.exist;
    expect(result.body.data.children).to.be.an("array");
    expect(result.body.data.children.indexOf(resourceTwo)).to.exist;
  });
});
