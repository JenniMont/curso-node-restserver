const { response } = require('express');
const { ObjectId } = require('mongoose').Types;

const { User, Category, Product } = require('../models');

const coleccionesPermitidas = [
	'users',
	'categories',
	'products',
	'productsbycategory',
	'rols',
];

/**
 *  BUSCAR USUARIO
 */
const buscarUsuarios = async (termino = '', res = response) => {
	const esMongoId = ObjectId.isValid(termino); // retornara un true or false

	if (esMongoId) {
		const categoria = await User.findById(termino);
		// res.json(categoria);
		return res.json({
			// si el user existe entonces retorna [] de user si no un [] vacio
			results: categoria ? [categoria] : [],
		});
	}

	//Busquedas no Sensitive i
	const regex = new RegExp(termino, 'i');

	//Buscar por el termino
	// const categorias = await User.find({ name: termino });
	const usuarios = await User.find({
		$or: [{ name: regex }, { email: regex }],
		$and: [{ state: true }], //$or es una expresion de moongose
	});

	res.json({
		results: usuarios,
	});
};

/**
 *  BUSCAR CATEGORIA
 */
const buscarCategorias = async (termino = '', res = response) => {
	const esMongoId = ObjectId.isValid(termino);
	if (esMongoId) {
		const categoria = await Category.findById(termino);
		return res.json({
			results: categoria ? [categoria] : [],
		});
	}

	//Busquedas no Sensitive i
	const regex = new RegExp(termino, 'i');

	const categorias = await Category.find({
		name: regex,
		state: true,
	});

	res.json({
		results: categorias,
	});
};

/**
 * BUSCAR POR PRODUCTO
 */
const buscarProductos = async (termino = '', res = response) => {
	const esMongoId = ObjectId.isValid(termino); // retornara un true or false

	if (esMongoId) {
		const producto = await Product.findById(termino).populate(
			'category',
			'name'
		);

		return res.json({
			results: producto ? [producto] : [],
		});
	}

	const regex = new RegExp(termino, 'i');

	const productos = await Product.find({
		name: regex,
		state: true,
	}).populate('category', 'name');

	res.json({
		results: productos,
	});
};

/**
 *  BUSCAR PRODUCTO POR CATEGORIA
 */
const buscarProductoPorCategoria = async (termino = '', res = response) => {
	try {
		const isMongoID = ObjectId.isValid(termino);

		if (isMongoID) {
			const producto = await Product.find({
				category: ObjectId(termino),
			}).populate('category', 'name');

			return res.json({
				results: producto,
			});
		}

		const regex = new RegExp(termino, 'i');

		const category = await Category.find({ name: regex, state: true });

		if (!category.length) {
			return res.status(400).json({
				msg: `No se encontro resultados con el termino (${termino})`,
			});
		}

		const productos = await Product.find({
			$or: [
				...category.map((category) => ({
					category: category._id,
				})),
			],
			$and: [{ state: true }],
		}).populate('category', 'name');

		res.json({
			results: productos,
		});
	} catch (err) {
		res.status(400).json(err);
	}
};

/**
 *  BUSCAR
 */
const buscar = (req, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case 'users':
			buscarUsuarios(termino, res);
			// res.json({
			// 	coleccion,
			// 	termino,
			// });
			break;

		case 'categories':
			buscarCategorias(termino, res);
			break;

		case 'products':
			buscarProductos(termino, res);
			break;

		case 'productsbycategory':
			buscarProductoPorCategoria(termino, res);
			break;

		default:
			res.status(500).json({
				msg: 'Se le olvido hacer esta busqueda',
			});
	}

	// res.json({
	// 	coleccion,
	// 	termino,
	// });
};

module.exports = {
	buscar,
};
