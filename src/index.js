const express = require("express");
const cors = require("cors");

const { v4: uuidv4 } = require("uuid");

const app = express();

app.use(cors());
app.use(express.json());

const users = [];

function checksExistsUserAccount(request, response, next) {
  const { username } = request.headers;

  const user = users.find((user) => user.username === username);

  if (!user) {
    return response.status(400).json({ error: "User not found" });
  }

  request.user = user;

  return next();
}

app.post("/users", (request, response) => {
  const { name, username } = request.body;

  const checkExistsUserAccount = users.some(
    (user) => user.username === username
  );

  if (checkExistsUserAccount) {
    return response.status(404).json({ error: "User already exists!" });
  }

  users.push({
    id: uuidv4(),
    name,
    username,
    todos: [],
  });

  return response.status(201).json({ success: "User successfully created!" });
});

app.get("/todos", checksExistsUserAccount, (request, response) => {
  const { user } = request;

  return response.json(user.todos);
});

app.post("/todos", checksExistsUserAccount, (request, response) => {
  const { title } = request.body;

  const { user } = request;

  const todosTask = {
    id: uuidv4(),
    title,
    done: false,
    deadline: new Date(),
    created_at: new Date(),
  };

  user.todos.push(todosTask);

  return response.status(200).json({ success: "Task launched successfully!" });
});

app.put("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { title, deadline } = request.body;
  const { id } = request.params;

  const checkExistsTask = user.todos.find(
    (checkExistsTask) => checkExistsTask.id === id
  );
  if (checkExistsTask) {
    checkExistsTask.title = title;
    checkExistsTask.deadline = deadline;

    return response.status(200).json({ success: "Task successfully charged!" });
  } else {
    return response.status(404).json({ error: `Task id:${id} not found!` });
  }
});

app.patch("/todos/:id/done", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const checkExistsTask = user.todos.find(
    (checkExistsTask) => checkExistsTask.id === id
  );
  if (checkExistsTask) {
    checkExistsTask.done = true;

    return response
      .status(200)
      .json({ success: "Task successfully charged for TRUE!" });
  } else {
    return response.status(404).json({ error: `Task id:${id} not found!` });
  }
});

app.delete("/todos/:id", checksExistsUserAccount, (request, response) => {
  const { user } = request;
  const { id } = request.params;

  const checkExistsTask = user.todos.find(
    (checkExistsTask) => checkExistsTask.id === id
  );
  if (checkExistsTask) {
    user.todos.splice(checkExistsTask, 1);

    return response.status(200).json({ success: "Task successfully DELETE!" });
  } else {
    return response.status(404).json({ error: `Task id:${id} not found!` });
  }
});

module.exports = app;
