const express = require("express");
require("./database/mongoose");
const Users = require("./database/models/user-model");
const Todos = require("./database/models/todo-model");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// METHOD: GET
// Get all the users
app.get("/users", async (req, res) => {
	try {
		const users = await Users.find({});
		if (!users.length) {
			return res.status(404).send("No users present!");
		}
		res.send(users);
	} catch (error) {
		res.status(500).send({ error_code: 500, message: "Something went wrong" });
	}
});

// METHOD: GET
// Get single the user
app.get("/users/:id", async (req, res) => {
	const _id = req.params.id;
	Users.findById(_id)
		.then((user) => {
			if (!user) {
				return res.status(404).send({
					error_code: 404,
					message: "No user found with this id",
				});
			}

			return res.status(200).send(user);
		})
		.catch((err) =>
			res.status(500).send({
				error_code: 500,
				message: "Something went wrong",
			})
		);
});

// METHOD: POST
// Use to Create a new user
app.post("/users", async (req, res) => {
	const user = new Users(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(500).send(e);
	}
});

// METHOD: GET
// Use to display all the todos
app.get("/todos", async (req, res) => {
	try {
		const todos = await Todos.find({});
		if (!todos.length) {
			return res.status(404).send({
				error_code: 404,
				message: "No Todos found!",
			});
		}
		return res.status(200).send(todos);
	} catch (error) {
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong",
		});
	}
});

// METHOD: GET
// Use to display particular todo
app.get("/todos/:id", async (req, res) => {
	const _id = req.params.id;
	try {
		const todo = await Todos.findById(_id);
		if (!todo) {
			return res.status(404).send({
				error_code: 404,
				message: "No todo present.",
			});
		}
		return res.status(200).send(todo);
	} catch (error) {
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong",
		});
	}
});

// METHOD: POST
// Use to Create a new todo
app.post("/todos", (req, res) => {
	const todo = new Todos(req.body);

	todo
		.save()
		.then(() => {
			res.status(201).send(todo);
		})
		.catch((err) => res.status(400).send(err));
});

app.listen(port, () => console.log("running at port number", port));
