const Favorite = require("../models/Favorite.model")
const { isValidObjectId } = require("mongoose")

const router = require("express").Router()

router.get("/", async (req, res, next) => {
	try {
		const allFavoritesOfUser = await Favorite.find({
			user: req.user._id,
		}).select("pet")

		res.json(allFavoritesOfUser)
	} catch (error) {
		next(error)
	}
})

router.post("/:petId", async (req, res, next) => {
	try {
		if (isValidObjectId(req.params.petId)) {
			const exist = await Favorite.findOne({
				user: req.user._id,
				pet: req.params.petId,
			})
			if (exist) {
				await Favorite.findOneAndDelete({
					user: req.user._id,
					pet: req.params.petId,
				})
				return res.sendStatus(204)
			}
			await Favorite.create({
				user: req.user._id,
				pet: req.params.petId,
			})
			return res.sendStatus(201)
		}
		return sendStatus(400)
	} catch (error) {
		next(error)
	}
})
router.delete("/:petId", async (req, res, next) => {
	try {
		await Favorite.findOneAndDelete({
			pet: req.params.petId,
			user: req.user._id,
		})
		return res.sendStatus(204)
	} catch (error) {
		next(error)
	}
})

module.exports = router
