const router = require("express").Router()
const Pet = require("./../models/Pet.model")
//! /api/pets

router.get("/", async (req, res, next) => {
	try {
		const allPets = await Pet.find()
		res.json(allPets)
	} catch (error) {
		next(error)
	}
})
router.get("/:id", async (req, res, next) => {
	try {
		const onePet = await Pet.findOne({
			_id: req.params.id,
			owner: req.user._id,
		})
		if (!onePet) {
			return res.status(401).json({ message: "unauthorized" })
		}
		res.json(onePet)
	} catch (error) {
		next(error)
	}
})
router.post("/", async (req, res, next) => {
	try {
		res.json(
			await Pet.create({
				name: req.body.name,
				owner: req.user._id,
				type: req.body.type,
			})
		)
	} catch (error) {
		next(error)
	}
})
router.delete("/:id", async (req, res, next) => {
	try {
		const deleted = await Pet.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		})
		if (!deleted) {
			return res.status(401).json({ message: "unauthorized" })
		}
		res.sendStatus(204)
	} catch (error) {
		next(error)
	}
})
router.get("/", async (req, res, next) => {
	try {
	} catch (error) {
		next(error)
	}
})

module.exports = router
