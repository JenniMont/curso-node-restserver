const { response } = require('express');
const { Category } = require('../models/index');

// getCategories - paginado - total - populate (mongoose)
const getCategories = async (req, res = response) => {
	//paginado
	const { limit = 5, since = 0 } = req.query;
	const query = { state: true };

	const [total, categories] = await Promise.all([
		// Coleccion de promesas las ejecuta de maera simultanea
		Category.countDocuments(query),
		Category.find(query)
			.populate('user', 'name')
			.skip(Number(since))
			.limit(Number(limit)),
	]);

	res.json({
		total,
		categories,
	});
};

// getCategory - populate -> va a devolver el obj de la categoria {}
const getCategoryById = async (req, res = response) => {
	const { id } = req.params;
	const category = await Category.findById(id).populate('user', 'name');

	res.json(category);
};

const createCategory = async (req, res = response) => {
	const name = req.body.name.toUpperCase();

	const categoryDB = await Category.findOne({ name: name });

	if (categoryDB) {
		return res.status(400).json({
			msg: `La categoria ${categoryDB.name}, ya existe`,
		});
	}

	// Generar la data a guardar
	const data = {
		name,
		user: req.user._id,
	};

	console.log(data);

	const category = new Category(data);

	// Guardar DB
	await category.save();

	res.status(201).json(category);
};

// updateCategory

const updateCategory = async (req, res = response) => {
	const { id } = req.params;
	console.log(id);
	const { state, user, ...data } = req.body;

	data.name = data.name.toUpperCase();
	data.user = req.user._id;

	const categoria = await Category.findByIdAndUpdate(id, data, { new: true });

	res.json(categoria);
};

// deleteCategory - state:false

const deleteCategory = async (req, res = response) => {
	const { id } = req.params;

	const categoriaBorrada = await Category.findByIdAndUpdate(
		id,
		{ state: false },
		{ new: true }
	);

	res.json(categoriaBorrada);
};

module.exports = {
	createCategory,
	getCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
};
