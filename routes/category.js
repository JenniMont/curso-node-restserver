const express = require('express');
const { check } = require('express-validator');

const { validarCampos, validarJWT } = require('../middlewares/index.js');

const { createCategory } = require('../controllers/category');

const router = express.Router();

/**
 * {{url}}/api/categories
 */

// Obtener todas las categorias - publico
router.get('/', (req, res) => {
	res.json('get');
});

// Obtener una categoria por idf - publico
router.get('/:id', (req, res) => {
	res.json('get - id');
});

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

// Actualizar cualquiera con token valido
router.put('/:id', (req, res) => {
	res.json('put');
});

// Borrar una categoria - Admin
router.delete('/:id', (req, res) => {
	res.json('delete');
});

module.exports = router;
