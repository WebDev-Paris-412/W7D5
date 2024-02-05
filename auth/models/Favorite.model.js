const { model, Schema } = require("mongoose")

const favoriteSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
	pet: {
		type: Schema.Types.ObjectId,
		ref: "Pet",
	},
})

const Favorite = model("Favorite", favoriteSchema)

module.exports = Favorite
