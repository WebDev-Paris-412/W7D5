const { Schema, model } = require("mongoose")

const userSchema = new Schema(
	{
		username: { type: String, maxLength: 40, minLength: 2 },
		email: {
			type: String,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			select: false,
		},
		githubId: Number,
		role: {
			type: String,
			enum: ["admin", "super-admin", "user"],
			default: "user",
		},
		picture: String,
	},
	{
		timestamps: true,
	}
)

const User = model("User", userSchema)

module.exports = User
