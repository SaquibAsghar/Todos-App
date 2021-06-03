const express = require("express");
require("./database/mongoose");
const Users = require("./database/models/user-model");
const Todos = require("./database/models/todo-model");
const users_route = require("./routes/users-route");
const todos_route = require("./routes/todos-route");
const app = express();
const port = process.env.PORT || 3000;


app.use(express.json());

app.use("/users",users_route);
app.use(todos_route)
// app.get("/users", users_route);

app.listen(port, () => console.log("running at port number", port));
