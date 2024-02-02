const bcrypt = require("bcryptjs")

const password = "my-strong-password"

const salt = 10
console.time("hashing")
const hashedPassword = bcrypt.hashSync(password, salt)
console.timeEnd("hashing")

console.log(hashedPassword)
console.time("compare")
console.log(
	bcrypt.compareSync(
		password,
		"$2a$10$j8JosF/09xa4lxN0i1LMQOjXc71qMjdcXzbSjw1V.5s0dC0TcOF0S"
	)
)
console.timeEnd("compare")
// console.log(
// 	bcrypt.compareSync(
// 		password,
// 		"$2a$10$4NPu2XNwU3yj9Miq2pO/VOko5/NlYT5ir.rq3mC/MzbmcIRM4XxVm"
// 	)
// )

function init() {
	const name = "Mozilla" // name is a local variable created by init
	function displayName() {
		// displayName() is the inner function, that forms the closure
		console.log(name) // use variable declared in the parent function
	}
	return displayName
}
const logger = init()
logger()
