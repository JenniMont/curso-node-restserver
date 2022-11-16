const { response } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');

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

const googleSignIn = async (req, res = response) => {
	const { id_token } = req.body;

	try {
		const googleUser = await googleVerify(id_token);
		console.log(googleUser);

		res.json({
			msg: 'Todo Bien',
			id_token,
		});
	} catch (error) {}
};

module.exports = {
	login,
	googleSignIn,
};
