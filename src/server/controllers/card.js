var config = require('../config');
var AWS = require('aws-sdk');
var moment = require('moment');

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
})

var s3 = new AWS.S3();

module.exports = {
	uploadAddressers(req, res) {
		let bucketName = "agent-cloud";
        let files = req.files;
        let date = moment().format('YYYY-MM-DD');

        // if bucket exists
        s3.headBucket({Bucket: bucketName}, function(err, data) {
            if (err){
              s3.createBucket({Bucket: bucketName}, function(err, data) {
                if (err){
                  console.log("Create Bucket Error:", err);
                  res.status(400).send(err.code);
                }
                else{
                  console.log("New Bucket:", data);

                  for(var i = 0; i < files.length; i++){
                    let params = {
                      Bucket: bucketName,
                      Key: 'addressers/'+date+'/'+req.body.user_id+'/'+files[i].originalname,
                      Body: files[i].buffer,
                      ACL:'public-read'
                    }

                    if(i == files.length - 1){
                      s3.putObject(params, function (perr, pres) {
                        if (perr) {
                          console.log("Error uploading data: ", perr);
                          return res.status(400).send(perr);
                        } else {
                          return res.status(200).send(pres);
                        }
                      });
                    }else {
                      s3.putObject(params, function (perr, pres) {
                        if (perr) {
                          console.log("Error uploading data: ", perr);
                        } else {
                          console.log(pres);
                        }
                      });
                    }

                  }
                }
              });
            }
            else{
              for(var i = 0; i < files.length; i++){
                let params = {
                  Bucket: bucketName,
                  Key: 'addressers/'+date+'/'+req.body.user_id+'/'+files[i].originalname,
                  Body: files[i].buffer,
                  ACL:'public-read'
                }

                if(i == files.length - 1){
                  s3.putObject(params, function (perr, pres) {
                    if (perr) {
                      console.log("Error uploading data: ", perr);
                      return res.status(400).send(perr);
                    } else {
                      return res.status(200).send(pres);
                    }
                  });
                }else {                  
                  s3.putObject(params, function (perr, pres) {
                    if (perr) {
                      console.log("Error uploading data: ", perr);
                    } else {
                      console.log(pres);
                    }
                  });
                }
              }
            }
        });
	}
}