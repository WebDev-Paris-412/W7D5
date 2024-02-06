// We reuse this import in order to have access to the `body` property in requests
const express = require("express")

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan")

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser")

// ℹ️ Needed to accept from requests from 'the outside'. CORS stands for cross origin resource sharing
// unless the request if from the same domain, by default express wont accept POST requests
const cors = require("cors")
const User = require("./../models/User.model")

const passport = require("passport")
const GithubStrategy = require("passport-github2").Strategy

passport.use(
	new GithubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: "http://localhost:5005/api/auth/github/callback",
			passReqToCallback: true,
		},
		async function (req, accessToken, refreshToken, profile, done) {
			console.log(profile)
			console.log(accessToken)
			console.log(refreshToken)
			try {
				const foundUser = await User.findOne({ githubId: profile.id })
				if (foundUser) {
					return done(null, foundUser)
				} else {
					const user = await User.create({
						username: profile.username,
						picture: profile._json.avatar_url,
						githubId: profile._json.id,
					})
					req.user = user
					return done(null, user)
				}
			} catch (error) {
				done(error, null)
			}
		}
	)
)

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:3000"

// Middleware configuration
module.exports = (app) => {
	// Because this is a server that will accept requests from outside and it will be hosted ona server with a `proxy`, express needs to know that it should trust that setting.
	// Services like heroku use something called a proxy and you need to add this to your server
	app.set("trust proxy", 1)

	// controls a very specific header to pass headers from the frontend
	app.use(
		cors({
			origin: [FRONTEND_URL],
		})
	)

	// In development environment the app logs
	app.use(logger("dev"))

	// To have access to `body` property in the request
	app.use(express.json())
	app.use(express.urlencoded({ extended: false }))
	app.use(cookieParser())
}
