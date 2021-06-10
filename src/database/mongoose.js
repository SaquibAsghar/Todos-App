const mongoose = require("mongoose");

// This will connect with the db: todos-app
mongoose.connect(process.env.MONGOOSE_CONNECT_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
	useCreateIndex: true,
});
