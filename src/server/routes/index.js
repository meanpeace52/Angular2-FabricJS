var User = require('../models/user');
var config = require('../config');
var jwt = require('jsonwebtoken');
var sendgrid = require('sendgrid')(config.sendgrid.api_key);
var multer = require('multer');
var userController = require('../controllers/user');
var cardController = require('../controllers/card');
var orderController = require('../controllers/order');
var upload = multer();

module.exports = (app, passport) => {
	app.get('/api', (req, res) => res.status(200).send({
		message: 'Welcome to the API!',
	}));

	app.post('/api/signup', function(req, res, next){
		User.findOne({ email :  req.body.email }, function(err, user) {
            if (err)
                return res.status(500).send(err);

            if (user)
                return res.status(401).send({success: false, message: 'That email is already taken.'});

            var newUser = new User(req.body);

            newUser.email    = req.body.email;
            newUser.password = newUser.generateHash(req.body.password);

            newUser.save(function(err) {
                if (err)
                    return res.status(500).send(err);

                var user = newUser.toObject();
                delete user['password'];

                // create a token
				var token = jwt.sign(user, config.auth_secret, {
					expiresIn: 86400 // expires in 24 hours
				});
				
				sendMail(user);

                return res.status(200).send({
                	success: true,
                	auth: true,
                	token: token,
                	user: user
                });
            });

        });
	});

	app.post('/api/login', function(req, res) {
		User.findOne({
			email: req.body.email
		}, function(err, user) {
			if (err) return res.status(500).send(err);

			if (!user)
				return res.status(401).send({success: false, message: 'Authentication failed. User not found.'});

			if (!user.validPassword(req.body.password))
				return res.status(401).send({success: false, message: 'Authentication failed. Wrong password.'});

            user = user.toObject();
            delete user['password'];

			var token = jwt.sign(user, config.auth_secret, {
				expiresIn: 86400 // expires in 24 hours
			});

			return res.status(200).send({
            	success: true,
            	auth: true,
            	token: token
            });
		});
	});

	app.get('/api/me', isLoggedIn, function(req, res){
		var user = req.user;
		return res.status(200).send({ data: user });
	});

    // app.get('/logout', function(req, res) {
    //     req.logout();
    //     res.redirect('/');
    // });

	app.put('/api/user/update', userController.update);
	// app.get('/api/user', isLoggedIn, userController.list);
	// app.get('/api/user/:userId', userController.getOne);
	// app.delete('/api/user/:userId', userController.remove);
	// app.post('/api/user/uploadPhoto', upload.single('file'), userController.uploadPhoto);
	app.post('/api/user/uploadPhoto', userController.uploadPhoto);
	app.post('/api/card/uploadAddressers', upload.array('files'), cardController.uploadAddressers);
	app.post('/api/order/thankyou', orderController.thankyou);
}

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
	var token = req.headers['token'];
	if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

	jwt.verify(token, config.auth_secret, function(err, decoded) {
		if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

		req.user = decoded;
		next();
	});
}

function sendMail(user) {
	var request = sendgrid.emptyRequest();
	request.body = {
		"from": {
			"email": "sales@agentcloud.com",
			"name": "Agent Cloud"
		},
		"personalizations" : [
			{
				"to": [
					{
						"email": user.email,
						"name": user.firstName+' '+user.lastName
					}
				],
				"substitutions": {
					"-firstName-": user.firstName,
					"-lastName-": user.lastName,
					"-email-": user.email,
					"-phone-": user.cellPhone					
				}
			}
		],
		"subject": "This is subject",
  		"template_id": config.sendgrid.signup_template_id
	};
	request.method = 'POST';
	request.path = '/v3/mail/send';

	sendgrid.API(request, function(error, response) {
		// console.log(response.statusCode);
		// console.log(response.body);
		// console.log(response.headers);
	});
}