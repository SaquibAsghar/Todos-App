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
	try {
		const user = await Users.findById({ _id: req.params.id });
		if (!user) {
			return res.status(404).send({
				error_code: 404,
				message: "No user found",
			});
		}

		res.status(200).send(user);
	} catch (error) {
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong",
		});
	}
});

// METHOD: PATCH
// use to update user detail
app.patch("/users/:id", async (req, res) => {
	const user_allowed_updates = ["name", "email", "password", "age"];
	const user_update = Object.keys(req.body);
	const toContinue = user_update.every((update) => {
		return user_allowed_updates.includes(update);
	});
	if (toContinue) {
		try {
			const user = await Users.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!user) {
				return res.status(404).send("No user");
			}

			return res.status(202).send(user);
		} catch (error) {
			res.status(500).send({
				error_code: 500,
				message: "Something went wrong",
				error,
			});
		}
	}

	return res.status(400).send("Invalid operation");
});

// METHOD: DELETE
// Delete a user
app.delete("/users/:id", async (req, res) => {
	try {
		const user = await Users.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).send("No user found to delete");
		}
		return res.status(201).send("User deleted");
	} catch (error) {
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong",
			error,
		});
	}
});
// METHOD: POST
// Use to Create a new user
app.post("/users", async (req, res) => {
	const user = new Users(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

// ----------- TODOS ---------------- //

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

// METHOD: DELETE
// Delete a todo
app.delete("/todos/:id", async (req, res) => {
	try {
		const todo = await Todos.findByIdAndDelete(req.params.id);
		if (!todo) {
			return res.status(404).send("No todo found to delete");
		}
		return res.status(201).send("Todo deleted " + todo);
	} catch (error) {
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong",
			error,
		});
	}
});

// METHOD: PATCH
// Update todo
app.patch("/todos/:id", async (req, res) => {
	const todo_allowed_update = ["title", "isCompleted"];
	const todo_update = Object.keys(req.body);

	const toContinue = todo_update.every((update) => {
		return todo_allowed_update.includes(update);
	});

	if (toContinue) {
		const todo = await Todos.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!todo) {
			return res.status(404).send({
				error_code: 404,
				message: "No todo found",
			});
		}
		return res.status(200).send(todo);
	}
	return res.status(400).send("Bad Operation");
});

// METHOD: POST
// Use to Create a new todo
app.post("/todos", async (req, res) => {
	const todo = new Todos(req.body);
	try {
		await todo.save();
		res.status(201).send(todo);
	} catch (error) {
		res.status(400).send({
			error_code: 400,
			message: "Something went wrong",
			error,
		});
	}
});

app.listen(port, () => console.log("running at port number", port));
