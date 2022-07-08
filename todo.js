import { ObjectID } from 'bson';
import express from 'express';
import { getDb } from './index.js';

export const todoRouter = express.Router();

todoRouter.get('/url', async function(req, res) {
  const query = req.query;

  const sortBy = req.query.sortBy || "name";
  const sortDir = parseInt(req.query.sortDir || -1);
  const pageSize = parseInt(req.query.pageSize || 5);
  const pageNo = parseInt(req.query.pageNo || 1);
  const offset = pageSize * (pageNo -1);
  // 1 -> 0
  // 2 -> 5
  // 3 -> 10

  console.log("sortBy", sortBy);
  console.log("sortDir", sortDir);
  console.log("pageSize", pageSize);
  console.log("pageNo", pageNo);

  const sortCOnfig = { [sortBy]: sortDir };
  console.log("sortCOnfig", JSON.stringify(sortCOnfig));

  let mongoClient = await getDb();

  const dbQuery = { "$or": [{ "viewCount": { "$lte": 1, "$gt": -1 }},{"name": "my todo 1123"}] };
  // const dbQuery = { "user.team.name": "Sales" };
  // const dbQuery = { "owner.team.name": "Dev 3" };
  // const dbQuery = { 
  //   "$text": {
  //     $search: "Shubham",
  //     // $language: "en",
  //     $caseSensitive: true,
  //     // $diacriticSensitive: <boolean>
  //   }
  // };

  const records = await mongoClient.db('todo-db').collection('todo')
  .find(dbQuery)
  .sort(sortCOnfig)
  .skip(offset)
  .limit(pageSize)
  .project({ "name": 0 })
  .toArray();

  return res.status(200).json(records);

});


todoRouter.get('/count', async function(req, res) {
  try {
    let mongoClient = await getDb();

  const dbQuery = { viewCount: { $lte: 1 } };

  const count = await mongoClient.db('todo-db').collection('todo')
  .find(dbQuery)
  .count();

  return res.status(200).json({ count: count });
  } catch (err) {
    console.log("error", err);
    return res.status(500).json({ message: "internal error occurred", success: false });
  }
  
});


todoRouter.post('/url', async function(req, res) {
  const body = req.body;
  
  let mongoClient = await getDb();

  const result = await mongoClient.db('todo-db').collection('todo').insertOne(body);

  // business logic

  // console.log('Inside url1 GET method');

  res.status(201).json({ id: result.insertedId });

});

todoRouter.delete('/url/:id', async function(req, res) {
  const params = req.params;

  let collection = (await getDb()).db('todo-db').collection('todo');

  const dbQuery = { "_id": new ObjectID(params.id) };
  const result = await collection.deleteOne(dbQuery);

  return res.status(200).json(result);
});

todoRouter.patch('/url/:id', async function(req, res) {
  const params = req.params;
  const body = req.body;

  let collection = (await getDb()).db('todo-db').collection('todo');

  const dbQuery = { "_id": new ObjectID(params.id) };
  const result = await collection.updateOne(dbQuery, { $set: body });

  return res.status(200).json(result);
});

// todoRouter.put('/url1/:id', async function(req, res) {
//   const params = req.params;
//   const body = req.body;

//   let collection = (await getDb()).db('todo-db').collection('todo');

//   const dbQuery = { "_id": new ObjectID(params.id) };
//   const result = await collection.updateOne(dbQuery, { $set: body });

//   return res.status(200).json(result);
// });

// module.exports = todoRouter;

// curl -X DELETE 'http://localhost:8080/todo/url1?qwerty=1234&parameter2=123456'
