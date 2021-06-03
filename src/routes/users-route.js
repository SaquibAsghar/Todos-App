const express = require("express");
const Users = require("../database/models/user-model");

const app = express();

const users_route = new express.Router();

// METHOD: GET
// Get all the users
users_route.get("/", async (req, res) => {
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
users_route.get("/:id", async (req, res) => {
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
users_route.patch("/:id", async (req, res) => {
	const user_allowed_updates = ["name", "email", "password", "age"];
	const user_update = Object.keys(req.body);
	const toContinue = user_update.every((update) => {
		return user_allowed_updates.includes(update);
	});
	if (!toContinue) {
		return res.status(400).send("Invalid operation");
	}
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
});

// METHOD: DELETE
// Delete a user
users_route.delete("/:id", async (req, res) => {
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
users_route.post("/", async (req, res) => {
	const user = new Users(req.body);
	try {
		await user.save();
		res.status(201).send(user);
	} catch (e) {
		res.status(400).send(e);
	}
});

module.exports = users_route;