const Rol = require('../models/rol');
const { User, Category, Product } = require('../models');

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

/**
 *  Validadores de categorias
 */

const existCategoryById = async (id = '') => {
	const existeCategoria = await Category.findById(id);

	// Verificar si el correo existe
	if (!existeCategoria) {
		throw new Error(`El id no existe ${id}`);
	}
};

//  Validadores de que no puedas insertar una categoria ya existente //lo vi enQ&A

const updateExistCategory = async (name = '', id) => {
	name = name.toUpperCase();

	const currentName = await Category.findOne({ id });

	if (currentName.name !== name) {
		const existeCategoria = await Category.findOne({ name });
		if (existeCategoria) {
			throw new Error(`La categoria ${name} ya existe`);
		}
	}
};

/**
 *  Validadores de PRODUCTOS
 */

const existProductById = async (id = '') => {
	const existeProducto = await Product.findById(id);

	// Verificar si el correo existe
	if (!existeProducto) {
		throw new Error(`El id  del producto no existe ${id}`);
	}
};

const existProductByName = async (name) => {
	const productos = await Product.find();

	productos.forEach((element) => {
		if (element.name.toUpperCase() == name.toUpperCase()) {
			throw new Error(`El producto ${name} ya existe en la DB!`);
		}
	});
};

module.exports = {
	esRolValido,
	emailExits,
	existsUserById,
	existCategoryById,
	updateExistCategory,
	existProductById,
	existProductByName,
};
