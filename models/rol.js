const mongoose = require('mongoose');
const { Schema } = mongoose;

const RolSchema = Schema({
	rol: {
		type: String,
		required: [true, 'El rol es obligatorio'],
	},
});

module.exports = mongoose.model('rol', RolSchema);
