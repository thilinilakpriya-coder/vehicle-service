const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    let token = authHeader && authHeader.split(' ')[1]; 
    if (!token) token = req.headers['x-auth-token'];

    if (!token) {
        return res.status(401).json({ message: "අවසර නැත, Token එකක් නැත!" });
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: "Token එක වලංගු නැත!" });
        req.user = decoded;
        next();
    });
};

// New Booking
router.post('/', async (req, res) => {
    try {
        const { date, time } = req.body; 
        const existingBooking = await Booking.findOne({ date, time });

        if (existingBooking) {
            return res.status(400).json({ 
                message: "Sorry, this date and time is already reserved. Please choose another time." 
            });
        }

        const newBooking = new Booking({
            ...req.body, 
            status: 'Pending' 
        });

        await newBooking.save();
        res.status(201).json({ message: "Booking Added Successfully!", data: newBooking });
        
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

//  Check status by vehicle number
router.get('/status/:vehicleNumber', async (req, res) => {
    try {
        const vNumber = req.params.vehicleNumber;
        const booking = await Booking.findOne({ 
            vehicleNumber: { $regex: new RegExp("^" + vNumber + "$", "i") } 
        }).sort({ createdAt: -1 });

        if (!booking) {
            return res.status(404).json({ message: "මෙම වාහන අංකය පද්ධතියේ හමු නොවීය." });
        }
        res.json(booking);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. Getting All Bookings 
router.get('/', verifyToken, async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 4. Update Status and Price
router.put('/:id/status', verifyToken, async (req, res) => {
    try {
        const { status, price } = req.body; 
        let updateData = { status: status };
        if (price !== undefined) updateData.price = price;

        const updatedBooking = await Booking.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            { new: true }
        );
        
        if (!updatedBooking) return res.status(404).json("Booking not found");
        res.json(updatedBooking);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// 5. Booking Delete
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
        if (!deletedBooking) return res.status(404).json("Booking not found");
        res.json({ message: "Booking Deleted Successfully!" });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;