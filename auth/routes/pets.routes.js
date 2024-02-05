const router = require("express").Router()
const Pet = require("./../models/Pet.model")
//! /api/pets

router.get("/", async (req, res, next) => {
	try {
		const allPets = await Pet.find().populate("owner")
		res.json(allPets)
	} catch (error) {
		next(error)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		const onePet = await Pet.findOne({
			_id: req.params.id,
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
		const createdPet = await Pet.create({
			name: req.body.name,
			owner: req.user._id,
			type: req.body.type,
		})
		res.status(201).json({ id: createdPet._id })
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

router.put("/:id", async (req, res, next) => {
	try {
		let { name, type } = req.body

		if (name === "") {
			name = undefined
		}
		if (type === "") {
			type = undefined
		}

		const updatedPet = await Pet.findOneAndUpdate(
			{
				_id: req.params.id,
				owner: req.user._id,
			},
			{
				name,
				type,
			},
			{
				new: true,
			}
		)
		res.status(202).json(updatedPet)
	} catch (error) {
		next(error)
	}
})

module.exports = router
