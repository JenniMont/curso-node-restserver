const Rol = require('../models/rol');
const User = require('../models/user');

const esRolValido = async (rol = '') => {
	const existeRol = await Rol.findOne({ rol });
	if (!existeRol) {
		throw new Error(`El rol ${rol} no esta registrado en la BD`);
	}
};

const emailExits = async (email = '') => {
	const existeEmail = await User.findOne({ email: email });

	if (existeEmail) {
		throw new Error(`El email: ${email}, ya existe `);
	}
};

const existsUserById = async (id = '') => {
	const existeUsuario = await User.findById(id);

	if (!existeUsuario) {
		throw new Error(`El id: ${id}, no existe `);
	}
};

module.exports = {
	esRolValido,
	emailExits,
	existsUserById,
};
