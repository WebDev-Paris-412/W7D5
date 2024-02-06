const router = require("express").Router()
const User = require("./../models/User.model")
const bcrypt = require("bcryptjs")
const salt = 12
const jwt = require("jsonwebtoken")
const isAuthenticated = require("./../middlewares/isAuthenticated")
const uploader = require("./../config/cloudinary.config")
const passport = require("passport")

// !  /api/auth
router.post("/signup", uploader.single("picture"), async (req, res, next) => {
	try {
		console.log(req.body)
		console.log(req.file)
		console.log(req.files)
		// return res.send("ok")
		const { username, email, password } = req.body

		if (!username || !email || !password) {
			return res
				.status(400)
				.json({ message: "Please input all the required fields." })
		}

		const userAlreadyExist = await User.findOne({ email: email })

		// Use regex to validate the email format

		// const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

		// if (!emailRegex.test(email)) {
		// 	res.status(400).json({ message: "Provide a valid email address." })
		// 	return
		// }
		// // Use regex to validate the password format
		// const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/

		// if (!passwordRegex.test(password)) {
		// 	res
		// 		.status(400)
		// 		.json({
		// 			message:
		// 				"Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
		// 		})
		// 	return
		// }

		if (userAlreadyExist) {
			return res.status(400).json({ message: "This email is already in use." })
		}

		const hashedPassword = await bcrypt.hash(password, salt)

		const createdUser = await User.create({
			username,
			email,
			password: hashedPassword,
			picture: req.file.path,
		})
		console.log(createdUser)

		return res.status(201).json({ message: "User created" })
	} catch (error) {
		next(error)
	}
})

router.post("/login", async (req, res, next) => {
	try {
		const { email, password } = req.body

		if (!email || !password) {
			return res
				.status(400)
				.json({ message: "Please input all the required fields." })
		}
		const existingUser = await User.findOne({ email }).select(
			"password username email"
		)
		console.log(existingUser)

		if (!existingUser) {
			return res.status(400).json({ message: "Wrong credentials" })
		}

		const matchingPassword = await bcrypt.compare(
			password,
			existingUser.password
		)

		if (!matchingPassword) {
			return res.status(400).json({ message: "Wrong credentials" })
		}

		/**
		 * We can login the user
		 */

		const token = jwt.sign(
			{ _id: existingUser._id },
			process.env.TOKEN_SECRET,
			{
				algorithm: "HS256",
				expiresIn: "7d",
			}
		)

		res.json({ authToken: token })
	} catch (error) {
		next(error)
	}
})

router.get("/verify", isAuthenticated, (req, res) => {
	res.json(req.user)
})

router.get(
	"/github",
	passport.authenticate("github", {
		scope: ["user"],
		session: false,
		passReqToCallback: true,
	})
)

router.get(
	"/github/callback",
	passport.authenticate("github", {
		session: false,
		passReqToCallback: true,
	}),
	function (req, res) {
		const token = jwt.sign({ _id: req.user._id }, process.env.TOKEN_SECRET, {
			algorithm: "HS256",
			expiresIn: "7d",
		})
		const url = `${process.env.ORIGIN}/callback?token=${token}`
		res.redirect(url)
	}
)

module.exports = router
