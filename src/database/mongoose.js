const mongoose = require("mongoose");
const Todos = require("./models/todo-model");
const Users = require("./models/user-model");

// This will connect with the db: todos-app
mongoose.connect("mongodb://localhost:27017/todos-app", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const myTodo = new Todos({
	title: "Buy some eggs",
	isCompleted: false,
});

const myUser = new Users({
	name: "Priyank Sharma",
	email: "psharma@asd.com",
	password: "Pass1234word",
	age: 44,
});

// myTodo.save().then(() => console.log(myTodo));

myUser
	.save()
	.then(() => console.log("Printing my User:\n\t", myUser))
	.catch((err) => console.log("Printing Error: ", { err }));
