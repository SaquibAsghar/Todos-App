const express = require("express");
require("./database/mongoose");
const users_route = require("./routes/users-route");
const todos_route = require("./routes/todos-route");
const todos = require("./database/models/todo-model");
const multer = require("multer");
const Users = require("./database/models/user-model");
const error_middleware = require("./middleware/error-middleware");

const app = express();
const port = process.env.PORT || 3000;

const uploadImage = multer({
	dest: "assets/userAvatar/", // destination folder
	limits: {
		//sets the max-size of the file
		fileSize: 1000000,
	},
	fileFilter(req, file, cb) {
		// cb(new Error('File must be a PDF'))
		// cb(undefined, true)
		// cb(undefined, false)
		// if(!file.originalname.endsWith('.jpg')){
		//     return cb(new Error('Please upload image of jpg format'))
		// }
		if (!file.originalname.match(/\.(jpg|jpeg)$/)) {
			return cb(new Error("Please upload image of jpg/jpeg format"));
		}
		return cb(undefined, true);
	},
});

app.use(express.json());
app.use("/users", users_route);

app.use(todos_route);
// app.get("/users", users_route);

app.post(
	"/users/profile/avatar-img",
	uploadImage.single("avatar"),
	(req, res) => {
		try {
			res.status(200).send("Avatar updated successfully");
		} catch (err) {
			res.send(err);
		}
	},
	(error, req, res, next) => {
        res.status(400).send({error: error.message})
    }
);
app.post(
	"/users/profile/avatar",
	error_middleware,
	(req, res) => {
		try {
			res.status(200).send("Avatar updated successfully");
		} catch (err) {
			res.send(err);
		}
	},
	(error, req, res, next) => {
        res.status(400).send({error: error.message})
    }
);

app.listen(port, () => console.log("running at port number", port));

const getFunc = async () => {
	const user = await Users.findById("60bb9ef8cffeec2f4c6fd9b3");
	await user.populate("todos").execPopulate();
	console.log(user.todos);
};

// getFunc()
