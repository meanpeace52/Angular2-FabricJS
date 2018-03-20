var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var draftSchema = new Schema({
	userId: {
		type: String
	},
	content: {
		type: String
	}
}, {
  timestamps: true
});

var Draft = mongoose.model('draft', draftSchema);
module.exports = Draft;
