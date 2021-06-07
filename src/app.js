const express = require("express");
require("./database/mongoose");
const users_route = require("./routes/users-route");
const todos_route = require("./routes/todos-route");
const sharp = require("sharp");
const Users = require("./database/models/user-model");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());
app.use("/users", users_route);

app.use(todos_route);

app.listen(port, () => console.log("running at port number", port));

const getFunc = async () => {
	const user = await Users.findById("60bb9ef8cffeec2f4c6fd9b3");
	await user.populate("todos").execPopulate();
	console.log(user.todos);
};

// getFunc()
