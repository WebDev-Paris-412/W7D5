const router = require("express").Router()
const jwt = require("jsonwebtoken")
const User = require("../models/User.model.js")
const isAuthenticated = require("./../middlewares/isAuthenticated")
const isRole = require("./../middlewares/isRole")

router.get("/", (req, res, next) => {
	res.json("All good in here")
})

router.use("/auth", require("./auth.routes.js"))

router.use(isAuthenticated)

router.use("/pets", require("./pets.routes.js"))

router.get("/secret", async (req, res, next) => {
	try {
		res.json(req.user)
	} catch (error) {
		next(error)
	}
})

router.get("/users", isRole("admin", "super-admin"), async (req, res, next) => {
	res.send("All the users informations")
})

module.exports = router
