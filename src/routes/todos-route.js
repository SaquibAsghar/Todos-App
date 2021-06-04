const express = require("express");
const Todos = require("../database/models/todo-model");

const app = express();

const todos_route = new express.Router();
// METHOD: GET
// Use to display all the todos
todos_route.get("/todos", async (req, res) => {
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
todos_route.get("/todos/:id", async (req, res) => {
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
todos_route.delete("/todos/:id", async (req, res) => {
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
todos_route.patch("/todos/:id", async (req, res) => {
	const todo_allowed_update = ["title", "isCompleted"];
	const todo_update = Object.keys(req.body);

	const toContinue = todo_update.every((update) => {
		return todo_allowed_update.includes(update);
	});

	if (toContinue) {
		try {
			const todo = await Todos.findById(req.params.id);

			todo_update.forEach((update) => (todo[update] = req.body[update]));

			await todo.save();

			if (!todo) {
				return res.status(404).send({
					error_code: 404,
					message: "No todo found",
				});
			}
			return res.status(200).send(todo);
		} catch (error) {
			return res.status(400).send({
				error_code: 400,
				message: error,
			});
		}
	}
	return res.status(400).send("Bad Operation");
});

// METHOD: POST
// Use to Create a new todo
todos_route.post("/todos", async (req, res) => {
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

module.exports = todos_route;
