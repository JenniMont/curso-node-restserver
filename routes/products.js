const express = require('express');
const { check } = require('express-validator');

const {
	validarCampos,
	validarJWT,
	isAdminRole,
} = require('../middlewares/index.js');

const {
	createProduct,
	getProduct,
	updateProduct,
	deleteProduct,
	getProducts,
} = require('../controllers/products');

const {
	existCategoryById,
	existProductById,
	existProductByName,
} = require('../helpers/db-validators');

const router = express.Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas los productos - publico
router.get('/', getProducts);

// Obtener un producto por id - publico
router.get(
	'/:id',
	[
		check('id', 'No es un ID valido').isMongoId(),
		validarCampos,
		check('id').custom(existProductById),
	],
	getProduct
);

// Crear producto - privado - cualquier persona con un toquen valido
router.post(
	'/',
	[
		validarJWT,
		check('name', 'El nombre es obligatorio').notEmpty(),
		// check('category', 'No es un id de Mongo').isMongoId(),
		check('category').custom(existCategoryById),
		validarCampos,
	],
	createProduct
);

// Actualizar - privado cualquiera con token valido
router.put(
	'/:id',
	[
		validarJWT,
		check('id').custom(existProductById),
		check('name').custom(existProductByName),
		validarCampos,
	],
	updateProduct
);

// Borrar un producto - Admin
router.delete(
	'/:id',
	[
		validarJWT,
		isAdminRole,

		check('id', 'No es un ID valido de Mongo').isMongoId(),
		validarCampos,
		check('id').custom(existProductById),

		validarCampos,
	],
	deleteProduct
);

module.exports = router;
