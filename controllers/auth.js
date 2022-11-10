const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');

const login = async (req, res = response) => {
	const { email, password } = req.body;

	try {
		// Verificar si el email existe
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - Email',
			});
		}

		// Si el usuario esta activo
		if (!user.state) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - Email',
			});
		}

		// Verificar la contraseña
		const validPassword = bcrypt.compareSync(password, user.password);
		if (!validPassword) {
			return res.status(400).json({
				msg: 'Usuario / Password no son correctos - Password',
			});
		}

		// Generar el JWT
		const token = await generarJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Hable con el administrador',
		});
	}
};

module.exports = {
	login,
};
