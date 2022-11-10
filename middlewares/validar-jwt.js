const { response, request } = require('express');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const validarJWT = async (req = request, res = response, next) => {
	const token = req.header('x-token');

	if (!token) {
		return res.status(200).json({
			msg: 'No hay token en la peticion',
		});
	}

	try {
		//extrae el uid
		const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY);

		// leer el user q corresp al uid
		const user = await User.findById(uid);

		if (!user) {
			return res.status(401).json({
				msg: 'Token no valido -  usuario no existe en DB',
			});
		}

		// Verififcar si el uid tiene estado en true
		if (!user.state) {
			return res.status(401).json({
				msg: 'Token no valido -  usuario con estado: false',
			});
		}

		req.user = user;

		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Token no valido',
		});
	}

	// console.log(token);
};

module.exports = {
	validarJWT,
};
