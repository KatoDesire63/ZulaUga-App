const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
    phone: {
    	type:String,
        default: true,
    },
    destination: {
		type: String,
		required: true,
	},
    date: {
    	type:Date,
        default: Date.now,
    },
    paymentMethod: {
		type: String,
		required: true,
	},
	mobileMoneyOperator: {
		type: String,
	},
    mobileMoneyNumber: {
    	type:String,
    },
    cardNumber: {
		type: String,
	},
	cardExpiry: {
		type: String,
	},
    cardCVV: {
    	type:String,
    },
    paypalEmail: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.module('Booking', BookingSchema);