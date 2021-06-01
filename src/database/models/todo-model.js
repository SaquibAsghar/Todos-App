const mongoose = require("mongoose");

const Todos = mongoose.model("Todos", {
	title: {
		type: String,
		required: true,
		trim: true,
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
});

module.exports= Todos