const express = require('express');
const cors = require('cors');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.usersPath = '/api/users';

		// Middlewares
		this.middlewares();
		// Application's Routes
		this.routes();
	}

	//Methods

	middlewares() {
		// CORS
		this.app.use(cors());

		//Parsebody
		this.app.use(express.json());

		// Public directory
		this.app.use(express.static('public'));
	}

	routes() {
		this.app.use(this.usersPath, require('../routes/users'));
	}

	listen() {
		this.app.listen(this.port, () => {
			console.log('Servidor coorriendo en puerto', this.port);
		});
	}
}

module.exports = Server;
