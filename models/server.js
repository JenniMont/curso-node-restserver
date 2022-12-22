const express = require('express');
const cors = require('cors');
const { dbConnection } = require('../database/configDB');
const user = require('./user');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		this.paths = {
			auth: '/api/auth',
			buscar: '/api/buscar',
			categories: '/api/category',
			products: '/api/products',
			users: '/api/users',
		};

		// Conectar a base de datos
		this.conectarDB();

		// Middlewares
		this.middlewares();
		// Application's Routes
		this.routes();
	}

	//Methods

	async conectarDB() {
		await dbConnection();
	}

	middlewares() {
		// CORS
		this.app.use(cors());

		//Parsebody
		this.app.use(express.json());

		// Public directory
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.paths.auth, require('../routes/auth'));
		this.app.use(this.paths.buscar, require('../routes/buscar'));
		this.app.use(this.paths.categories, require('../routes/category'));
		this.app.use(this.paths.products, require('../routes/products'));
		this.app.use(this.paths.users, require('../routes/users'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('Servidor coorriendo en puerto', this.port);
		});
	}
}

module.exports = Server;
