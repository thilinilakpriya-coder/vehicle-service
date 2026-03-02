const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// 1.Add Review 
router.post('/', async (req, res) => {
    try {
        const newReview = new Review(req.body);
        await newReview.save();
        res.status(201).json({ message: "Review submitted successfully. It will appear on the website after admin approval." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. Getting only approved reviews 
router.get('/approved', async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'Approved' }).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Getting All reviews
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Approve Review 
router.put('/:id/status', async (req, res) => {
    try {
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id, 
            { status: req.body.status }, 
            { new: true }
        );
        res.json(updatedReview);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Delete Review 
router.delete('/:id', async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        res.json({ message: "Review removed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;