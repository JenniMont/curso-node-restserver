const { response, request } = require('express');

const usersGet = (req = request, res = response) => {
	const { q, name = 'No name', apikey, page = 1, limit } = req.query;

	res.status(500).json({
		msg: 'GET API controlador ',
		q,
		name,
		page,
		apikey,
		limit,
	});
};

const usersPost = (req, res = response) => {
	// const body = req.body;
	const { nombre, edad } = req.body;

	res.json({
		msg: 'POst API controlador',
		nombre,
		edad,
	});
};

const usersPut = (req, res = response) => {
	// const id = req.params.id;
	const { id } = req.params;

	res.json({
		msg: 'PUT API controlador',
		id,
	});
};

const usersPatch = (req, res = response) => {
	res.json({
		msg: 'PATCH API controlador',
	});
};

const usersDelete = (req, res = response) => {
	res.json({
		msg: 'ddelete API contolador',
	});
};

module.exports = {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
};
