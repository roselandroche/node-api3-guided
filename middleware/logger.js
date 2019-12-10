module.exports = () => (req, res, next) => {
	console.log(`${req.ip} - ${req.protocol} - ${req.method} - ${req.url} - ${req.get("User-Agent")}`)
	// this middleware function is done,
	// move on to the next one in the stack
	next()
}