var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	Establishment = require('./EstablishmentModel.js');

var promotionsSchema = new Schema({
	_company: {
		type: Schema.ObjectId,
		ref: 'Establishment'
	},
	productName: String,
	price: {
		unit: String,
		actual: Number,
		old: Number
	},
	startDate: Date,
	endDate: Date,
	reason: String,
	shelf_life: Date,
	conservation: String,
	description: String,
	images: [String],
	evaluates: {
		user_likes: [mongoose.Schema.Types.ObjectId],
		comments: [{
			type: Schema.ObjectId,
			ref: 'Comment'
		}]
	}
});

module.exports = mongoose.model('Promotion', promotionsSchema);
