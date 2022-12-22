const { response } = require('express');
const { body } = require('express-validator');
const { Product } = require('../models/index');

// getCategories - paginado - total - populate (mongoose)
const getProducts = async (req, res = response) => {
	//paginado
	const { limit = 5, since = 0 } = req.query;
	const query = { state: true };

	const [total, products] = await Promise.all([
		// Coleccion de promesas las ejecuta de maera simultanea
		Product.countDocuments(query),
		Product.find(query)
			.populate('user', 'name')
			.populate('category', 'name')
			.skip(Number(since))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		products,
	});
};

// getCategory - populate -> va a devolver el obj de la categoria {}
const getProduct = async (req, res = response) => {
	const { id } = req.params;
	const product = await Product.findById(id)
		.populate('user', 'Product')
		.populate('category', 'name');
	res.json(product);
};

const createProduct = async (req, res = response) => {
	const { state, user, ...body } = req.body; //ignoro el state, user y guardo todo en body

	const productDB = await Product.findOne({ name: body.name });

	if (productDB) {
		return res.status(400).json({
			msg: `El producto  ${productDB.name}, ya existe`,
		});
	}

	// Generar la data a guardar
	const data = {
		...body,
		name: body.name.toUpperCase(),
		user: req.user._id,
	};

	console.log(data);

	const product = new Product(data);

	// Guardar DB
	await product.save();

	res.status(201).json(product);
};

// updateCategory

const updateProduct = async (req, res = response) => {
	const { id } = req.params;
	const { state, user, ...data } = req.body;

	if (data.name) {
		data.name = data.name.toUpperCase();
	}

	data.user = req.user._id;

	const product = await Product.findByIdAndUpdate(id, data, { new: true });

	res.json(product);
};

// deleteCategory - state:false

const deleteProduct = async (req, res = response) => {
	const { id } = req.params;

	const productoBorrado = await Product.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(productoBorrado);
};

module.exports = {
	getProducts,
	getProduct,
	createProduct,
	updateProduct,
	deleteProduct,
};
