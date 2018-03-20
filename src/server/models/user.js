// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt   = require('bcrypt-nodejs');

// create a schema
var userSchema = new Schema({
    firstName: { 
      type: String 
    },
    lastName: { 
      type: String
    },
    email: { 
      type: String, 
      required: true, 
      unique: true 
    },
    password: { 
      type: String 
    },
    photo: { 
      type: String 
    },
    cellPhone: { 
      type: String 
    },
    telePhone: { 
      type: String 
    },
    breNumber: { 
      type: String 
    },
    fax: { 
      type: String 
    },
    website: { 
      type: String
    },
    billingAddres: {
      type: String
    },
    shippingAddress: {
      type: String
    },
    businessAddress: {
      type: String
    },
    country: {
      type: String
    },
    state: {
      type: String
    },
    city: {
      type: String
    },
    zipcode: {
      type: String
    },
    facebook: {
      type: String
    },
    linkedin: {
      type: String
    },
    twitter: {
      type: String
    },
    instagram: {
      type: String
    },
    pinterest: {
      type: String
    }
}, {
  timestamps: true
});

// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

var User = mongoose.model('users', userSchema);
module.exports = User;