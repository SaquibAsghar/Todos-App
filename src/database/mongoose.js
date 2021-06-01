const mongoose = require("mongoose");
const validator = require("validator");

// This will connect with the db: todos-app
mongoose.connect("mongodb://localhost:27017/todos-app", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

const Todos = mongoose.model("Todos", {
	title: {
		type: String,
		required: true,
	},
	isCompleted: {
		type: Boolean,
	},
});

const myTodo = new Todos({
	title: "Buy some eggs",
	isCompleted: false,
});

myTodo.save().then(() => console.log(myTodo));

const User = mongoose.model("User", {
	name: {
		type: String,
		required: true,
		lowercase: true,
	},
	email: {
		type: String,
		required: true,
		validate(val) {
			if (!validator.isEmail(val)) {
				throw new Error("Email is not correct");
			}
		},
	},
	password: {
		type: String,
		required: true,
		minLength: 6,
	},
	age: {
		type: Number,
		validate(val) {
			if (val < 0 || val === 0) {
				throw new Error("Age must be a positive number.");
			}
		},
	},
});

const myUser = new User({
	name: "Syed Saquib Asghar",
	email: "test@@asd.com",
	password: "1234456",
	age: 0,
});

myUser
	.save()
	.then(()=>console.log("Printing my User:\n\t", myUser))
	.catch((err) => console.log("Printing Error: ", {err}));
