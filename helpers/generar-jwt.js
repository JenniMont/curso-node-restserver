const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
	//uid User unique identifier

	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.SECRETORPUBLICKEY,
			{
				expiresIn: '730d',
			},
			(err, token) => {
				if (err) {
					console.log(err);
					reject('No se pudo general el token');
				} else {
					resolve(token);
				}
			}
		);
	});
};

module.exports = {
	generarJWT,
};
