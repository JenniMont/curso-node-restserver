const path = require('path');
const { v4: uuidv4 } = require('uuid');

const subirArchivo = (
	files,
	extensionesPermitidas = ['png', 'jpg', 'jpeg', 'git'],
	carpeta = ''
) => {
	return new Promise((resolve, reject) => {
		// if (!files) {
		// 	return reject(`Debe adjuntar un archivo`);
		// }

		const { archivo } = files;
		const nombreCortado = archivo.name.split('.');
		const extension = nombreCortado[nombreCortado.length - 1];

		//validar extension

		if (!extensionesPermitidas.includes(extension)) {
			return reject(
				`La extension ${extension} no es permitida, solo estan permitidas las extendiones : ${extensionesPermitidas}`
			);
		}
		// res.json({ extension });
		// console.log(nombreCortado);
		const nombreTemp = uuidv4() + '.' + extension;
		uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemp);

		archivo.mv(uploadPath, (err) => {
			if (err) {
				console.log(err);
				reject(err);
			}

			resolve(uploadPath);
		});
	});
};

module.exports = {
	subirArchivo,
};
