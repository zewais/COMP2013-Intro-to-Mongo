//Imports
import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import Task from "./models/task";

//Main variables
const server: Express = express();
const port: number = 3000;
const MONGO_URL = process.env.MONGO_URL;

//Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Check if the url exist in .env file
if (!MONGO_URL) {
  throw new Error("Mongo URL is missing from .env");
}

//Open connection with Mongo DB and listen to server on port
mongoose
  .connect(MONGO_URL)
  .then(() =>
    server.listen(port, () => console.log(`Server running on ${port}`)),
  )
  .catch((error) => console.log(error));

//GET root
server.get("/", (request, response) => {
  response.send("Server Live");
});

//GET data from DB
server.get("/data", async (request, response) => {
  try {
    const data = await Task.find();
    response.status(200).send(data);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//POST a task to DB
server.post("/data", async (request, response) => {
  const { id, title, checked } = request.body;
  const task = new Task({
    id,
    title,
    checked,
  });
  try {
    await task.save();
    response.status(201).send("Task added successfully");
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

server.patch("/data", async (request, response) => {
  const { id, title, checked } = request.body;
  try {
    await Task.findOneAndUpdate({ id }, { title, checked });
    response.status(201).send(`task id ${id} is updated`);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

server.delete("/data/:id", async (request, response) => {
  const { id } = request.params;
  try {
    await Task.findOneAndDelete({ id });
    response.status(201).send(`task id ${id} is deleted`);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
