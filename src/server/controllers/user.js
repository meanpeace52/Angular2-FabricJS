var User = require("../models/user");
var config = require('../config');
var fs = require('fs');
var AWS = require('aws-sdk');
var multer = require('multer');

AWS.config.update({
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
})

var s3 = new AWS.S3();


module.exports = {
   list(req, res) {
        User.find(function(err, users) {
            if (err) return res.status(500).send(err);

            return res.status(200).send({
                    success: true,
                    status: 200,
                    data: users
                })
        });
    },
    update(req, res) {
        User.findById(req.body._id, function(err, user){
            if (err) return res.status(500).send(err);
            
            if (!user)
                return res.status(401).send({success: false, message: 'User not found.'});

            User.update({ "_id": req.body._id }, req.body, function (err, data) {
                if (err) return res.status(500).send(err);

                delete user['password'];
                return res.status(200).send({
                    success: true,
                    data: user
                });
            });            
        });
    },
    remove(req, res) {
        User.findByIdAndRemove(req.params.userId, function(err, data){
            if(err) {
                res.send({
                    status: 500,
                    error: err,
                    success: false
                })
            } else {
                if(data) {
                    res.send({
                        status: 200,
                        success: true,
                        message: "delete success"
                    })
                } else {
                    res.send({
                        status: 404,
                        success: false,
                        message: "Not found"
                    })
                }
            }
        });
    },
    getOne(req, res) {
        User.findById(req.params.userId, function(err, user){
            if(err) {
                console.log(err)
                res.send({
                    status: 500,
                    success: false,
                    message: "Server Error"
                }) 
            } else {
                if(user) {
                    res.send({
                        status: 200,
                        success: true,
                        message: "get Success",
                        data: user
                    })
                } else {
                    res.send({
                        status: 404,
                        success: true,
                        message: "not found",
                        data: []
                    })
                }
            }
        });
    },
    uploadPhoto(req, res) {     
        var storage = multer.diskStorage({
            destination: function(req, file, callback){
                var userId = req.body.user_id;
                var dir = './dist/assets/images/headshots';
                if (!fs.existsSync(dir+'/'+userId)){
                    fs.mkdirSync(dir+'/'+userId);
                }
                callback(null, dir+'/'+userId);
            },
            filename: function(req, file, callback) {
                callback(null, file.originalname);
            }
        });

        var upload = multer({storage: storage}).single('file');

        upload(req, res, function(err){
            var userId = req.body.user_id;

            if(err){
                res.status(400).send(err);
            }else {
                var dir = './src/assets/images/headshots';
                if (!fs.existsSync(dir+'/'+userId)){
                    fs.mkdirSync(dir+'/'+userId);
                }

                fs.createReadStream('./dist/assets/images/headshots/'+userId+'/'+req.file.originalname).pipe(fs.createWriteStream('./src/assets/images/headshots/'+userId+'/'+req.file.originalname));
                res.end('File is uploaded');
            }
        });
     

        // let bucketName = "agent-cloud";
        // let file = req.file;

        // // if bucket exists
        // s3.headBucket({Bucket: bucketName}, function(err, data) {
        //     if (err){
        //       s3.createBucket({Bucket: bucketName}, function(err, data) {
        //         if (err){
        //           console.log("Create Bucket Error:", err);
        //           res.status(400).send(err.code);
        //         }
        //         else{
        //           console.log("New Bucket:", data);

        //           let params = {
        //             Bucket: bucketName,
        //             Key: 'headshots/'+req.body.user_id+'/'+file.originalname,
        //             Body: file.buffer,
        //             ACL:'public-read'
        //           }

        //           s3.putObject(params, function (perr, pres) {
        //             if (perr) {
        //               console.log("Error uploading data: ", perr);
        //               res.status(400).send(perr);
        //             } else {
        //               res.status(200).send(pres);
        //             }
        //           });

        //         }
        //       });
        //     }
        //     else{
        //       let params = {
        //         Bucket: bucketName,
        //         Key: 'headshots/'+req.body.user_id+'/'+file.originalname,
        //         Body: file.buffer,
        //         ACL:'public-read'
        //       }

        //       s3.putObject(params, function (perr, pres) {
        //         if (perr) {
        //           console.log("Error uploading data: ", perr);
        //           res.status(400).send(perr);
        //         } else {
        //           res.status(200).send(pres);
        //         }
        //       });

        //     }
        // });
    },
    
}