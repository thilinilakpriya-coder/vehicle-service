const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
    serviceName: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String }
});

module.exports = mongoose.model('Service', serviceSchema);