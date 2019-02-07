# Project Title

Company Model Structure Challenge

## Getting Started

Amazing Co for example needs to model how her company is structured so they can do awesome stuff.
They have a root node (only one) and several children nodes, each one with its own children as well. It's a tree-based structure.

Case Study

![Image description](/public/images/casestudy.png)


### Endpoints 
Creating a node
```bash
curl -X POST \
  http://localhost:3000/api/v1/tree \
  -H 'Content-Type: application/json' \
  -d '{
	"node": "Ads Assistant"
}'
```

Changing the parent of a node
```bash
curl -X PUT \
  http://localhost:3000/api/v1/tree \
  -H 'Content-Type: application/json' \
  -d '{
	"node": "ads assistant",
	"parent": "seo & marketing"
}'
```

```bash
Getting the descendants of a node
curl -X GET \
  http://localhost:3000/api/v1/tree/co-founder \
```

### Installing

docker-compose up

Descendants of a Co-founder

```javascript
{
        "parent": {
            "_id": "5c5cb695c6cd720013383021",
            "updatedAt": "2019-02-07T22:54:47.653Z",
            "createdAt": "2019-02-07T22:52:05.233Z",
            "node": "co-founder",
            "parent": "general manager",
            "root": "general manager",
            "__v": 0,
            "children": [
                "seo & marketing",
                "development team",
                "design team",
                "finance"
            ]
        },
        "children": [
            {
                "_id": "5c5cb710c6cd720013383024",
                "updatedAt": "2019-02-07T22:58:14.023Z",
                "createdAt": "2019-02-07T22:54:08.427Z",
                "node": "design team",
                "parent": "co-founder",
                "root": "general manager",
                "__v": 0,
                "children": [
                    "graphic design assistant"
                ]
            },
            {
                "_id": "5c5cb6efc6cd720013383023",
                "updatedAt": "2019-02-07T23:04:05.459Z",
                "createdAt": "2019-02-07T22:53:35.296Z",
                "node": "development team",
                "parent": "co-founder",
                "root": "general manager",
                "__v": 0,
                "children": [
                    "product lead"
                ]
            },
            {
                "_id": "5c5cb72ec6cd720013383025",
                "updatedAt": "2019-02-07T22:55:23.009Z",
                "createdAt": "2019-02-07T22:54:38.254Z",
                "node": "finance",
                "parent": "co-founder",
                "root": "general manager",
                "__v": 0,
                "children": [
                    "tax assistant"
                ]
            },
            {
                "_id": "5c5cb6b5c6cd720013383022",
                "updatedAt": "2019-02-07T23:06:23.855Z",
                "createdAt": "2019-02-07T22:52:37.137Z",
                "node": "seo & marketing",
                "parent": "co-founder",
                "root": "general manager",
                "__v": 0,
                "children": [
                    "ads assistant"
                ]
            }
        ]
    }
```

## Running the tests

npm run test

### Test

A node can be added in a Tree which automatically adds up to a root node if one exists, else it becomes the root

```javascript
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
```
