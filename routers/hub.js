const express = require("express")
const messageRouter = require("./message")
const hubs = require("../hubs/hubs-model.js")
const { validateHubId, validateHubData } = require("../middleware/validate")

// Creates a new router, or "sub-application" within our app
// Routers can have their own endpoints, middleware, etc.
const router = express.Router()

// We can nest routers within routers, as deep as we want
router.use("/:id/messages", messageRouter)

// The endpoint is built off of the parent router's endpoint.
// So this endpoint is accessed at /api/hubs/:id
router.get("/", (req, res) => {
  const opts = {
    // These values all comes from the URL's query string
    // (everthing after the question mark)
    limit: req.query.limit,
    sortby: req.query.sortby,
    sortdir: req.query.sortdir,
  }

  hubs.find(opts)
    .then(hubs => {
      res.status(200).json(hubs)
    })
    .catch(error => {
      // can now send errors directly through to the
      // error handler, rather than handling each error
      // individually
      next(error)
    })
})

router.get("/:id", validateHubId(), (req, res) => {
  // since middleware builds off of each other,
  // we can attach values to the request from a middleware
  // function, and use the values in later middleware functions.
  // (req.hub is attached in `validateHubId`)
  res.json(req.hub)
})

router.post("/", validateHubData(), async (req, res) => {
  try {
    const hub = await hubs.add(req.body)
    res.status(201).json(hub)
  } catch(err) {
    next(err)
  }
})

// just like defining global middleware with `server.use`, we can
// define middleware for specific routes by chaining them together
// like this. We can call as many middleware functions as we want.
router.put("/:id", validateHubData(), validateHubId(), (req, res) => {
  hubs.update(req.hub.id, req.body)
    .then(hub => {
      res.status(200).json(hub)
    })
    .catch(error => {
      next(error)
    })
})

router.delete("/:id", validateHubId(), (req, res) => {
  hubs.remove(req.hub.id)
    .then(() => {
      res.status(200).json({ message: "The hub has been nuked" })
    })
    .catch(error => {
      next(error)
    })
})

module.exports = router