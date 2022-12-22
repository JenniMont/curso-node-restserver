const express = require('express');
const { check } = require('express-validator');

const {
	validarCampos,
	validarJWT,
	isAdminRole,
} = require('../middlewares/index.js');

const {
	createCategory,
	getCategories,
	getCategoryById,
	updateCategory,
	deleteCategory,
} = require('../controllers/category');

const {
	existCategoryById,
	updateExistCategory,
} = require('../helpers/db-validators');

const router = express.Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - publico
router.get('/', getCategories);

// Obtener una categoria por idf - publico
router.get(
	'/:id',
	[
		check('id', 'No es un ID valido').isMongoId(),
		validarCampos,
		check('id').custom(existCategoryById),
	],
	getCategoryById
);

// Crear categoria - privado - cualquier persona con un toquen valido
router.post(
	'/',
	[
		validarJWT,
		check('name', 'El nombre es obligatorio').notEmpty(),
		validarCampos,
	],
	createCategory
);

// Actualizar - privado cualquiera con token valido
router.put(
	'/:id',
	[
		validarJWT,
		check('name', 'El nombre es obligatorio').notEmpty(),
		check('id').custom(existCategoryById),
		validarCampos,
	],
	updateCategory
);

// Borrar una categoria - Admin
router.delete(
	'/:id',
	[
		validarJWT,
		isAdminRole,

		check('id', 'No es un ID valido de Mongo').isMongoId(),
		validarCampos,
		check('id').custom(existCategoryById),

		validarCampos,
	],
	deleteCategory
);

module.exports = router;
