const express = require("express");
require("./database/mongoose");
const Users = require("./database/models/user-model");
const Todos = require("./database/models/todo-model");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/", function (req, res) {
	res.send("Welcome to homepage");
});

// METHOD: POST
// Use to Create a new user
app.post("/users", (req, res) => {
	const user = new Users(req.body);
	user
		.save()
		.then(() => res.status(201).send(user))
		.catch((err) => res.status(400).send(err));
});


// METHOD: POST
// Use to Create a new task
app.post('/tasks', (req, res)=>{
	const todo = new Todos(req.body)

	todo.save().then(()=>{
		res.status(201).send(todo)
	}).catch(err => res.status(400).send(err))
})

app.listen(port, () => console.log("running at port number", port));
