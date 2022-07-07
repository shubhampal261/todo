import { ObjectID } from 'bson';
import express from 'express';
import { getDb } from './index';

export const todoRouter = express.Router();

todoRouter.get('/url1', async function(req, res) {
  const query = req.query;

  
  let mongoClient = await getDb();

  const dbQuery = { "$or": [{ "viewCount": { "$lte": 1, "$gt": -1 }},{"name": "my todo 1123"}] };

  const records = await mongoClient.db('todo-db').collection('todo').find(dbQuery).toArray();

  return res.status(200).json(records);

});

todoRouter.post('/url1', async function(req, res) {
  const body = req.body;
  
  let mongoClient = await getDb();

  const result = await mongoClient.db('todo-db').collection('todo').insertOne(body);

  // business logic

  // console.log('Inside url1 GET method');

  res.status(201).json({ id: result.insertedId });

});

todoRouter.delete('/url1/:id', async function(req, res) {
  const params = req.params;

  let collection = (await getDb()).db('todo-db').collection('todo');

  const dbQuery = { "_id": new ObjectID(params.id) };
  const result = await collection.deleteOne(dbQuery);

  return res.status(200).json(result);
});

// module.exports = todoRouter;

// curl -X DELETE 'http://localhost:8080/todo/url1?qwerty=1234&parameter2=123456'
