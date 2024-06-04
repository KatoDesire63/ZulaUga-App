const express = require('express');
const momgoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;


//Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(_dirname, 'public')));


//Connect to MongoDB
mongoose.connect('mongodb+srv://katodesire9:Ur2x6F6eNk9DHepY.@zulauga.kk5tmgu.mongodb.net/?retryWrites=true&w=majority&appName=Zulauga', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));


//Routes
const testimonialsRoutes = require('./routes/testimonials');
const bookingsRoutes = require('./routes/bookings');

app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/bookings', bookingsRoutes);


//Serve static HTML files
app.get('/', (req, res) => {
	res.sendFile(path.join(_dirname,'public', 'index.html'));
});

app.get('/book-now', (req, res) => {
	res.sendFile(path.join(_dirname, 'public', 'book-mow.html'));
});

app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});