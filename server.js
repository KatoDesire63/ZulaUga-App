// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Load environment variables from a .env file if available
require('dotenv').config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());  // Replaces bodyParser.json()
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI || 'your_default_mongo_uri';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

// Import routes
const testimonialsRoutes = require('./routes/testimonials');
const bookingsRoutes = require('./routes/bookings');

// Use routes
app.use('/api/testimonials', testimonialsRoutes);
app.use('/api/bookings', bookingsRoutes);

// Serve static HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/book-now', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'book-now.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const helmet = require('helmet');
const morgan = require('morgan');

// Security middleware
app.use(helmet());

// Logging middleware
app.use(morgan('combined'));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});