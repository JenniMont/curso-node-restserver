const { response } = require('express');
const { Category } = require('../models/index');

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

module.exports = {
	createCategory,
};
