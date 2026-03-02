const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

//  Login Details
const ADMIN_USER = {
    username: "admin",
    password: "admin123" 
};

const JWT_SECRET = 'your_super_secret_key_123'; 

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login Attempt:", username); 

    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        
        const token = jwt.sign(
            { username: ADMIN_USER.username }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        return res.json({
            success: true,
            token: token,
            message: "Login Successful!"
        });
    } else {
        
        return res.status(401).json({ 
            success: false, 
            message: "Invalid Username or Password!" 
        });
    }
});

module.exports = router;