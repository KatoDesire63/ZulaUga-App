const Booking = require('../models/Booking');

exports.getAllBookings = async (req, res) => {
	try {
		const bookings = await Booking.find();
		res.json(bookings);
	} catch (err) {
		res.status(500).json({ message:err.message });
	}
};

exports.createBooking = async (req, res) => {
	const booking = new Booking(req.body);
	try {
		const savedBooking = await booking.save();
		res.status(201).json(savedBooking);
	} catch (err) {
		res.status(400).json({ message:err.message });
	}
};