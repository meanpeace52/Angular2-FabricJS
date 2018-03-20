var config = require('../config');
var sendgrid = require('sendgrid')(config.sendgrid.api_key);

module.exports = {

	thankyou(req, res) {
		var user = req.body.user;
		sendThankyouEmail(user);

		return res.status(200).send({
        	success: true,
        	message: 'success'
        });
	}
}

function sendThankyouEmail(user) {
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
				]
			}
		],
		"subject": "This is subject",
  		"template_id": config.sendgrid.thank_order_template_id
	};
	request.method = 'POST';
	request.path = '/v3/mail/send';

	sendgrid.API(request, function(error, response) {
		// console.log(response.statusCode);
		// console.log(response.body);
		// console.log(response.headers);
	});
}