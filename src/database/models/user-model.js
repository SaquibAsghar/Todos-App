const bcryptjs = require('bcryptjs')
const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
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
})

userSchema.pre('save', async function(){
	const user = this
	console.log(user.isModified('password'))
	if(user.isModified('password')){
		user.password = await bcryptjs.hash(user.password, 10)
	}
})

const Users = mongoose.model("User", userSchema);

module.exports = Users