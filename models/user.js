const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = Schema({
	name: {
		type: String,
		required: [true, 'El nombre es obligatorio'],
	},
	email: {
		type: String,
		unique: true,
		required: [true, 'El correo es obligatorio'],
	},
	password: {
		type: String,
		required: [true, 'El password es obligatorio'],
	},

	rol: {
		type: String,
		required: true,
		default: 'USER_ROLE',
		enum: ['ADMIN_ROLE', 'USER_ROLE'],
	},
	state: {
		type: Boolean,
		default: true,
	},
	google: {
		type: Boolean,
		default: false,
	},

	img: { type: String },
});

// Borra el password // "__V = version
UserSchema.methods.toJSON = function () {
	const { __v, password, _id, ...user } = this.toObject();
	user.uid = _id;
	return user;
};

module.exports = mongoose.model('User', UserSchema);
