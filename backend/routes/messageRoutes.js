const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

//  Save Message 
router.post('/', async (req, res) => {
    try {
        const newMessage = new Message(req.body);
        await newMessage.save();
        res.status(201).json({ message: "පණිවිඩය සාර්ථකව යොමු කරන ලදි!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// View All messages 
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//  Marking a message as "Seen".

router.put('/:id/read', async (req, res) => {
    try {
        await Message.findByIdAndUpdate(req.params.id, { isRead: true });
        res.json({ success: true, message: "Message marked as read" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Message
router.delete('/:id', async (req, res) => {
    try {
        await Message.findByIdAndDelete(req.params.id);
        res.json({ message: "Message removed successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;