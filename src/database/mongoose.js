const mongoose = require("mongoose");
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
				throw new Error("Value cannot be less than 0 or 0");
			}
		},
	},
});

const myUser = new User({
	name: "Syed Saquib Asghar",
	email: "test@asd.com",
	password: "1234456",
	age: 0,
});

myUser.save().then(console.log(myUser)).catch(err=> console.log("Printing Error: ",err))
