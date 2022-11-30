const Category = require('./category');
const Rol = require('./rol');
const Server = require('./server');
const User = require('./user');

module.exports = {
	...Category,
	...Rol,
	...Server,
	...User,
};
