var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var shippingInfoSchemma = new Schema({
	address: {
		type: String
	},
	city: {
		type: String
	},
	state: {
		type: String
	},
	country: {
		type: String
	},
	zipcode: {
		type: String
	},
	company: {
		type: String
	},
	fax: {
		type: String
	}
}, {
  timestamps: true
});

var ShippingInfo = mongoose.model('shippingInfo', shippingInfoSchemma);
module.exports = ShippingInfo;
