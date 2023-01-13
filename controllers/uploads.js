const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

const { response } = require('express');
const { subirArchivo } = require('../helpers');

const { User, Product } = require('../models');

const cargarArchivo = async (req, res = response) => {
	// console.log(req.files);
	// if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
	// 	res.status(400).json({ msg: 'No hay archivos q subir.' });
	// 	return;
	// }

	try {
		// Imagenes
		// const pathCompleto = await subirArchivo(req.files);
		// const nombre = await subirArchivo(req.files, ['txt', 'md'], 'textos');
		const nombre = await subirArchivo(req.files, undefined, coleccion);
		res.json({
			// path: pathCompleto,
			nombre,
		});
	} catch (msg) {
		res.status(400).json({ msg: `No hay archivo` });
	}
};

const actualizarImagen = async (req, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;

	switch (coleccion) {
		case 'users':
			modelo = await User.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}

			break;

		case 'products':
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe el producto con el id ${id}`,
				});
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esto' });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Hay que borrar la imagen del servidor
		const pathImagen = path.resolve(
			__dirname,
			'../uploads',
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) {
			fs.unlinkSync(pathImagen);
		}
	}
	const nombre = await subirArchivo(req.files, undefined, coleccion);
	modelo.img = nombre;

	await modelo.save();

	res.json(modelo);
};

const actualizarImagenCloudinary = async (req, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;

	switch (coleccion) {
		case 'users':
			modelo = await User.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}

			break;

		case 'products':
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe el producto con el id ${id}`,
				});
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esto' });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		const nombreArr = modelo.img.split('/');
		const nombre = nombreArr[nombreArr.length - 1];
		const [public_id] = nombre.split('.');
		cloudinary.uploader.destroy(public_id);
	}

	const { tempFilePath } = req.files.archivo;
	// console.log(req.files);
	const { secure_url } = await cloudinary.uploader.upload(tempFilePath);

	modelo.img = secure_url;

	await modelo.save();

	res.json(modelo);
};

const mostrarImagen = async (req, res = response) => {
	const { coleccion, id } = req.params;

	let modelo;

	switch (coleccion) {
		case 'users':
			modelo = await User.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}

			break;

		case 'products':
			modelo = await Product.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe el producto con el id ${id}`,
				});
			}

			break;

		default:
			return res.status(500).json({ msg: 'Se me olvido validar esto' });
	}

	// Limpiar imágenes previas
	if (modelo.img) {
		// Hay que borrar la imagen del servidor
		const pathImagen = path.resolve(
			__dirname,
			'../uploads',
			coleccion,
			modelo.img
		);
		if (fs.existsSync(pathImagen)) {
			return res.sendFile(pathImagen);
		}
	}

	const pathImagen = path.join(__dirname, '../assets/no-image.jpg');

	res.sendFile(pathImagen);
};

module.exports = {
	cargarArchivo,
	actualizarImagen,
	mostrarImagen,
	actualizarImagenCloudinary,
};
