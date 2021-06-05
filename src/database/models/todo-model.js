const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
			trim: true,
		},
		isCompleted: {
			type: Boolean,
			default: false,
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{
		timestamps: true,
	}
);

const Todos = mongoose.model("Todo", todoSchema);

module.exports = Todos;
