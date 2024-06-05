const Testimonial = require('../models/Testimonial');

exports.getAllTestimonials = async (req, res) => {
	try {
		const testimonials = await Testimonial.find();
		res.json(testimonials.sort(() => 0.5 - Math.random()));
	} catch (err) {
		res.status(500).json({ message:err.message });
	}
};

exports.createTestimonial = async (req, res) => {
	const testimonial = new Testimonial(req.body);
	try {
		const savedTestimonial = await testimonial.save();
		res.status(201).json(savedTestimonial);
	} catch (err) {
		res.status(400).json({ message:err.message });
	}
};