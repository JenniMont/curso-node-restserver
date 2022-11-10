const { response } = require('express');

const isAdminRole = (req, res = response, next) => {
	if (!req.user) {
		return res.status(500).json({
			msg: 'Se requiere verificar el Role sin validar el token primero',
		});
	}

	const { rol, name } = req.user;

	if (rol !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `El ${name} no es administrador - No puede hacer esto`,
		});
	}

	next();
};

const hasRole = (...roles) => {
	// console.log(roles);

	return (req, res = response, next) => {
		if (!req.user) {
			return res.status(500).json({
				msg: 'Se require verificar el role sin validar el token primero',
			});
		}

		if (!roles.includes(req.user.role)) {
			return res.status(401).json({
				msg: `El servicio requiere uno de estos roles ${roles}`,
			});
		}

		next();
	};
};

module.exports = {
	isAdminRole,
	hasRole,
};
