const { response, json } = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/user');
const { generarJWT } = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');
const { DefaultTransporter } = require('google-auth-library');

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

	const { email, name, img } = await googleVerify(id_token);
	// console.log(email, name, img);

	try {
		const { email, name, img } = await googleVerify(id_token);
		// console.log(googleUser);
		let user = await User.findOne({ email });

		if (!user) {
			const data = {
				name,
				email,
				password: '',
				img,
				google: true,
				rol: 'USER_ROLE',
			};

			user = new User(data);
			await user.save();
		}

		//Si el user en BD
		if (!user.state) {
			return res.status(400).json({
				msg: ' Hable con el administrador, usuario bloqueado',
			});
		}

		// Generar el JWT
		const token = await generarJWT(user.id);

		res.json({
			user,
			token,
		});
	} catch {
		res.status(400).json({
			// ok: false,
			msg: 'El token no se pudoo verificar',
		});
	}
};

module.exports = {
	login,
	googleSignIn,
};
