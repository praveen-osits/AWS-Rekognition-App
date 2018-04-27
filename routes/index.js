var express = require('express');
var fs = require('fs');
var router = express.Router();
var AWS = require('aws-sdk');
var dataUriToBuffer = require('data-uri-to-buffer');

AWS.config.loadFromPath('./config.json');

var rekognition = new AWS.Rekognition();
//console.log("rekognition",rekognition)

router.get('/', function(req, res, next) {
	//console.log(req.body);
	res.render('index', { title: 'Express' });
	//return res.status(200).json({statusCode: 200, message:"It works!!!"});
});

router.post('/imgData', function(req, res, next) {
	var imageDataUrl = req.body.imageDataUrl; 
	//console.log(imageDataUrl);
	var dataBuffer = decodeImageDataUrlToBuffer(imageDataUrl);
	detectLabelsInImage(dataBuffer, function(result){
		res.status(200).json(result);
	})
	
	
});

function decodeImageDataUrlToBuffer(imageDataUrl){
	var decodedBuffer = dataUriToBuffer(imageDataUrl);
	return decodedBuffer;
}

function detectLabelsInImage(imageDataBuffer, callback){
	var params = {
		Image: { /* required */
		  	Bytes: imageDataBuffer
		}
	};
	  
	rekognition.detectLabels(params, function(err, data) {
		if (err) {
			console.log("err", err.stack); // an error occurred
			callback({status:"error", message:err.stack, data:null})
		}
		else{
			console.log(data);           // successful response
			callback({status:"success", message:"Success!", data:data})
		}
	});
}



module.exports = router;