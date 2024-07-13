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

const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;
const OPENWEATHER_API_KEY = process.env.SEAPRIDE; // Replace with your API key variable name

// Middleware to enable CORS (if needed)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    next();
});

// Route to fetch weather data
app.get('/weather', async (req, res) => {
    const { lat, lon } = req.query;
    const weatherEndpoint = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}`;

    try {
        const response = await fetch(weatherEndpoint);
        if (!response.ok) {
            throw new Error('Weather data not available');
        }
        const weatherData = await response.json();
        res.json(weatherData);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
