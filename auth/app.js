// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config()
const { rateLimit } = require("express-rate-limit")

// ℹ️ Connects to the database
require("./db")

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express")

const app = express()

app.use(
	rateLimit({
		windowMs: 1000,
		limit: 10,
	})
)

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app)

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes")
app.use("/api", indexRoutes)

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app)

module.exports = app
