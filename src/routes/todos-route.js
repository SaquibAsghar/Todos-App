const express = require("express");
const Todos = require("../database/models/todo-model");
const authenticate = require("../middleware/auth-middleware");

const todos_route = new express.Router();
// METHOD: GET
// Use to display all the todos
todos_route.get("/todos", authenticate, async (req, res) => {
	const match = {};
	const sort = {};
	if (req.query.isCompleted) {
		match.isCompleted = req.query.isCompleted === "true";
	}
	if (req.query.sortBy) {
		const part = req.query.sortBy.split(":");
		sort[part[0]] = part[1] === "desc" ? -1 : 1;
		console.log(sort);
	}
	try {
		// const todos = await Todos.find({owner: req.user._id});
		const todo = await req.user
			.populate({
				path: "todos",
				match,
				options: {
					limit: parseInt(req.query.limit),
					skip: parseInt(req.query.skip),
					sort,
				},
			})
			.execPopulate();
		if (!todo) {
			return res.status(404).send({
				error_code: 404,
				message: "No Todos found!",
			});
		}
		return res.status(200).send(todo.todos);
	} catch (error) {
		console.log(error);
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong from task",
		});
	}
});

// METHOD: GET
// Use to display particular todo
todos_route.get("/todos/:id", authenticate, async (req, res) => {
	const _id = req.params.id;
	try {
		// const todo = await Todos.findById(_id);

		const todo = await Todos.findOne({
			_id,
			owner: req.user._id,
		});

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
todos_route.delete("/todos/:id", authenticate, async (req, res) => {
	try {
		const todo = await Todos.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});
		// console.log(todo)
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
todos_route.patch("/todos/:id", authenticate, async (req, res) => {
	const todo_allowed_update = ["title", "isCompleted"];
	const todo_update = Object.keys(req.body);

	const toContinue = todo_update.every((update) => {
		return todo_allowed_update.includes(update);
	});

	if (toContinue) {
		try {
			// const todo = await Todos.findById(req.params.id);
			const todo = await Todos.findOne({
				_id: req.params.id,
				owner: req.user._id,
			});

			if (!todo) {
				return res.status(404).send({
					error_code: 404,
					message: "No todo found",
				});
			}
			todo_update.forEach((update) => (todo[update] = req.body[update]));

			await todo.save();
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
todos_route.post("/todos", authenticate, async (req, res) => {
	const todo = new Todos({
		...req.body,
		owner: req.user._id,
	});
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
