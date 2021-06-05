const bcryptjs = require("bcryptjs");
const express = require("express");
const Users = require("../database/models/user-model");
const authenticate = require("../middleware/auth-middleware");

const users_route = new express.Router();

// METHOD: GET
// Get all the users
users_route.get("/profile", authenticate, async (req, res) => {
	res.send(req.user);
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
		const user = await Users.findById(req.params.id);

		user_update.forEach((update) => (user[update] = req.body[update]));

		await user.save();

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
		const token = await user.generateAuthToken();
		res.status(201).send({ user, token });
	} catch (e) {
		res.status(400).send(e);
	}
});

// METHOD: POST
// Use for user login
users_route.post("/login", async (req, res) => {
	try {
		const user = await Users.findByCredential(
			req.body.email,
			req.body.password
		);

		const token = await user.generateAuthToken();

		res.status(200).send({ user, token }); 
		console.log(user)
	} catch (error) {
		res.status(401).send({
			error_code: 401,
			error: error.message,
		});
	}
});

// METHOD: POST
// Use for logout
users_route.post("/logout", authenticate, async (req, res) => {
	try {
		const userToken = req.header("Authorization").replace("Bearer ", "");
		// console.log(userToken)
		req.user.tokens = req.user.tokens.filter((token) => {
			return token.token !== userToken;
		});

		await req.user.save();

		console.log("TOKEN", req.user.tokens)

		return res.status(200).send("Logout Mehal");
	} catch (error) {
		res.status(500).send({
			error_code: 500,
			message: "Something went wrong",
		});
	}
});

// METHOD: POST
// Use for logout from all devices
users_route.post('/logoutAll', authenticate, async(req, res)=>{
	try {
		req.user.tokens = []
		await req.user.save()
		return res.status(200).send("Logout from all devices.");
	} catch (error) {
		
	}
})




module.exports = users_route;
