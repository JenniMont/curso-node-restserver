const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { login, googleSignIn } = require('../controllers/auth');

const router = Router();

router.post(
	'/login',
	[
		check('email', 'El correo es obligatorio').isEmail(),
		check('password', 'La contrasena es obligatoria').notEmpty(),
		validarCampos,
	],
	login
);
router.post(
	'/google',
	[check('id_token', 'El ID TOKEN es necesario').notEmpty(), validarCampos],
	googleSignIn
);

module.exports = router;
