const { model, Schema } = require("mongoose")

const petSchema = new Schema({
	name: String,
	owner: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	type: String,
})

const Pet = model("Pet", petSchema)

module.exports = Pet
