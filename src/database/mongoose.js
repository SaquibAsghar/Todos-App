const mongoose = require("mongoose");

// This will connect with the db: todos-app
mongoose.connect("mongodb://localhost:27017/todos-app", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

