const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorySchema = Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},

	state: {
		type: Boolean,
		default: true,
		required: true,
	},

	user: {
		type: Schema.Types.ObjectID,
		ref: 'User',
		require: true,
	},
});

module.exports = mongoose.model('Category', CategorySchema);
