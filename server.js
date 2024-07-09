const express = require('express');
const AWS = require('aws-sdk');
const bodyParser = require('body-parser');
const cors = require('cors');
             require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

AWS.config.update({accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                   secretAccessKey:process.env.AWS_SECRET-ACCESS_KEY,
                   region:process.env.AWS_REGION
});

const s3 = new AWS.s3();
const bucketName = process.env.S3_BUCKET_NAME;
app.post('/save-form', (req,res) => {
	const formData = JSON.stringify(req.body);
	const params = {
		Bucket: bucketName,
		Key: `form/${Date.now()}.json`, //Unique file name
		Body: formData,
		ContentType: 'application/json'
	};

	s3.upload(params,(err, data) => {
		if (err) {
			console.error('Error uploading data:',err);
			res.status(500).send('Error uploading data');
		} else {
			console.log('Upload successful:',data);
		}
	});
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`)
});

//Backend Endpoint to Fetch Form Data
app.get('/get-form/:key',(req,res) => {
	const params = {
		Bucket: bucketName,
		Key: `form/${req.params.key}`
	};

	s3.getObject(params,(err, data) => {
		if (err) {
			console.error('Error fetching data:',err);
			res.status(500).send('Error fetching data');
		} else {
			res.status(200).send(data.Body.toString('utf-8'));
		}
	});
}); 