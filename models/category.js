const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const CategorySchema = Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
		unique: true,
	},

	state: {
		type: Boolean,
		default: true,
		required: true,
	},

	user: {
		type: Schema.Types.ObjectID,
		ref: 'User',
		required: true,
	},
});

CategorySchema.methods.toJSON = function () {
	const { __v, state, ...data } = this.toObject();

	return data;
};

module.exports = mongoose.model('Category', CategorySchema);
