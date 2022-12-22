const jwt = require('jsonwebtoken');

const generarJWT = (uid = '') => {
	//uid User unique identifier

	return new Promise((resolve, reject) => {
		const payload = { uid };

		jwt.sign(
			payload,
			process.env.SECRETORPUBLICKEY,
			{
				expiresIn: '1730001h', // Si tienes throw new Error('Wrong number of segments in token: ' + jwt) es por q expiro el token
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
