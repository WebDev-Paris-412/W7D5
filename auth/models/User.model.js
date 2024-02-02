const { Schema, model } = require("mongoose")

const userSchema = new Schema(
	{
		username: { type: String, maxLength: 40, minLength: 2 },
		email: {
			type: String,
			required: [true, "Email is required."],
			unique: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			required: [true, "Password is required."],
			select: false,
		},
		role: {
			type: String,
			enum: ["admin", "super-admin", "user"],
			default: "user",
		},
	},
	{
		timestamps: true,
	}
)

const User = model("User", userSchema)

module.exports = User
