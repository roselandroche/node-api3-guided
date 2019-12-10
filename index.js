const express = require("express")
const helmet = require("helmet")
const agent = require("./middleware/agent")
const logger = require("./middleware/logger")
// const morgan = require("morgan")
const hubRouter = require("./routers/hub")
const welcomeRouter = require("./routers/welcome")

const server = express()

// third-party middleware from NPM
server.use(helmet())
server.use(logger())
// server.use(morgan("short"))

// custom middleware
server.use(agent("insomnia"))

// built-in express middleware
server.use(express.json())

// Bring all our subroutes into the main application
// (Remember, subroutes can have more children routers)
server.use("/", welcomeRouter)
server.use("/api/hubs", hubRouter)

// if no route handlers send our response, this middleware
// function will get called at the end of the stack.
server.use((req, res) => {
	res.status(404).json({
		message: "Route was not found",
	})
})

// any time `next` gets called with a parameter,
// as in next("some error"), it treats it as an
// error and the middleware stack comes directly
// to this handler.
server.use((err, req, res, next) => {
	console.log(err)
	res.status(500).json({
		message: "An internal error occurred, please try again later",
	})
})

server.listen(4000, () => {
  console.log("\n*** Server Running on http://localhost:4000 ***\n")
})