const express = require("express");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.get("/", function (req, res) {
	res.send("Welcome to homepage")
});

app.post('/users', (req, res)=>{
	const createdUser = req.body
	res.status(201).send(createdUser)
})

app.listen(port, () => console.log("running at port number", port));
