const { response, request } = require('express');
const bcrypt = require('bcryptjs'); // Paquete para encriptar password

const User = require('../models/user');
const { emailExits } = require('../helpers/db-validators');

const usersGet = async (req = request, res = response) => {
	// const { q, name = 'No name', apikey, page = 1, limit } = req.query;
	const { limit = 5, since = 0 } = req.query;
	const query = { state: true };

	// const usuarios = await User.find(query)
	// 	.skip(Number(since))
	// 	.limit(Number(limit));

	// const total = await User.countDocuments(query);

	const [total, users] = await Promise.all([
		// Coleccion de promesas las ejecuta de maera simultanea
		User.countDocuments(query),
		User.find(query).skip(Number(since)).limit(Number(limit)),
	]);

	res.json({
		total,
		users,
	});
};

const usersPost = async (req, res = response) => {
	// const { nombre, edad } = req.body;
	// const body = req.body;
	// const user = new User(body); //instancia de user

	// Creacion de un usuario
	const { name, email, password, rol } = req.body;
	const user = new User({ name, email, password, rol });

	// Verificar si el correo existe
	await emailExits();

	// Encriptar el password
	const salt = bcrypt.genSaltSync(10);
	user.password = bcrypt.hashSync(password, salt);

	// Guardar en DB
	await user.save(); //mongoose graba el registro

	res.json({
		msg: 'POst API controlador',
		user,
	});
};

const usersPut = async (req, res = response) => {
	// const id = req.params.id;
	const { id } = req.params;
	const { _id, password, google, ...resto } = req.body;

	// TODO validar contra base de datos
	if (password) {
		// Encriptar el password
		const salt = bcrypt.genSaltSync(10);
		resto.password = bcrypt.hashSync(password, salt);
	}

	const user = await User.findByIdAndUpdate(id, resto);

	res.json(user);
};

const usersPatch = (req, res = response) => {
	res.json({
		msg: 'PATCH API controlador',
	});
};

const usersDelete = async (req, res = response) => {
	const { id } = req.params;

	// Fisicamente lo borramos
	// const user = await User.findByIdAndDelete(id);

	const user = await User.findByIdAndUpdate(id, { state: false });

	res.json({
		user,
	});
};

module.exports = {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
};
