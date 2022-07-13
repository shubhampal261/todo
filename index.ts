import express from 'express';
import { MongoClient } from 'mongodb';
import { todoRouter } from './todo';

export const server = express();
export let mongoClient: MongoClient | null;

server.use(express.json({}));

server.use('/todo', todoRouter);

initializeDb();

// GET POST PUT DELETE PATCH

// https://locahost:8080/todo

server.listen(8080, 'localhost', function() {
  console.log("Started");
});

// module.exports = server;

// mongodb://crm:crm@localhost:27018/crm-core-db?retryWrites=true&writeConcern=majority&useUnifiedTopology=true

// mongodb+srv://shubham:shubham.pal@cluster0.tifj7.mongodb.net/?retryWrites=true&w=majority

async function initializeDb() {
  mongoClient = await MongoClient.connect('mongodb+srv://shubham:shubham.pal@cluster0.tifj7.mongodb.net/?retryWrites=true&w=majority')
  .then((client) => {
    console.log('db connection successful');
    return client;
  })
  .catch((err) => {
    console.log('Error while db connection');
    return null
  });
  if (mongoClient == null) {
    return null
  }
  return mongoClient;
}

export async function getDb(): Promise<MongoClient> {
  if (!mongoClient) {
    await initializeDb();
  }
  if (!mongoClient) {
    throw Error('db connection failed');
  }
  return mongoClient;
}
