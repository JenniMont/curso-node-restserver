const { Router } = require('express');
const { check } = require('express-validator');

const {
	validarCampos,
	validarJWT,
	isAdminRole,
	hasRole,
} = require('../middlewares');

const {
	esRolValido,
	emailExits,
	existsUserById,
} = require('../helpers/db-validators');

const {
	usersGet,
	usersPost,
	usersPut,
	usersPatch,
	usersDelete,
} = require('../controllers/users');

const router = Router();

router.get('/', usersGet);

router.put(
	'/:id',
	[
		check('id', 'No es un ID valido').isMongoId(),
		check('id').custom(existsUserById),
		check('rol').custom(esRolValido),
		validarCampos,
	],
	usersPut
);

router.post(
	'/',
	[
		check('name', 'El nomre es obligatorio').notEmpty(),
		check('password', 'El password debe ser mas de 6 letras').isLength({
			min: 6,
		}),
		check('email', 'El email ya ha sido registrado previamente').isEmail(),
		check('email').custom(emailExits),
		// check('role', 'No es un rol valido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
		check('rol').custom(esRolValido), //(rol) =>esRolValido(rol)
		validarCampos,
	],
	usersPost
);
router.delete(
	'/:id',
	[
		validarJWT,
		// isAdminRole,
		hasRole('ADMIN_ROLE', 'VENTAS_ROLE'),
		check('id', 'No es un ID valido').isMongoId(),
		check('id').custom(existsUserById),
		validarCampos,
	],
	usersDelete
);

router.patch('/', usersPatch);

module.exports = router;
