const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    customerName: String,
    phone: String,
    vehicleNumber: String,
    vehicleModel: String,
    serviceType: String,
    price: { type: Number, default: 0 }, 
    date: String,
    time: String,
    notes: String,
    status: { type: String, default: 'Pending' }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Booking', bookingSchema);