module.exports = (requiredAgent) => (req, res, next) => {
	const userAgent = req.get("User-Agent").toLowerCase()

	if (!userAgent.includes(requiredAgent)) {
		// it's good practice to use `new Error` when creating
		// errors in Node, and passing that rather than a raw string
		return next(new Error(`Must be using ${requiredAgent}`))
	}

	next()
}