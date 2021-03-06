const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("json-web-token");
const Todos = require("./todo-model");

const userSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
			lowercase: true,
			trim: true,
		},
		email: {
			type: String,
			required: true,
			trim: true,
			lowercase: true,
			unique: true,
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
			validate(val) {
				if (val.toLowerCase().includes("password")) {
					throw new Error("Password cannot contain word 'password'");
				}
			},
		},
		age: {
			type: Number,
			default: 18,
			validate(val) {
				if (val < 0 || val === 0) {
					throw new Error("Age must be a positive number.");
				}
			},
		},
		tokens: [
			{
				token: {
					type: String,
					required: true,
				},
			},
		],
		avatar: {
			type: Buffer,
		},
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("todos", {
	ref: "Todo",
	localField: "_id",
	foreignField: "owner",
});

userSchema.statics.findByCredential = async function (email, password) {
	const user = await Users.findOne({ email });
	if (!user) {
		throw new Error("Invalid credntial. Please try again.");
	}
	const isMatch = await bcryptjs.compare(password, user.password);
	if (!isMatch) {
		throw new Error("Invalid credntial. Please try again.");
	}

	return user;
};

// To hash password when update
userSchema.pre("save", async function () {
	const user = this;
	console.log(user.isModified("password"));
	if (user.isModified("password")) {
		user.password = await bcryptjs.hash(user.password, 10);
	}
});

userSchema.pre("remove", async function () {
	const user = this;

	await Todos.deleteMany({ owner: user._id });
});

userSchema.methods.toJSON = function () {
	const user = this;
	// console.log(user);
	const userObj = user.toObject();
	delete userObj.password;
	delete userObj.tokens;
	delete userObj.avatar;
	return userObj;
};

userSchema.methods.generateAuthToken = async function () {
	const user = this;
	const payload = { _id: user.id.toString(), time: new Date() };
	let token = await jwt.encode(process.env.JWT_SECRET, payload);
	token = token.value;
	// console.log(token);
	// console.log(user.tokens.push({ token }));
	// console.log(user.tokens);
	user.tokens = user.tokens.concat({ token });
	await user.save();

	return token;
};

const Users = mongoose.model("User", userSchema);

module.exports = Users;
