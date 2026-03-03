const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// ⚠️ ආරක්ෂාව සඳහා මේ විස්තර පසුව .env එකට දැමීම සුදුසුයි
const ADMIN_USER = {
    username: "admin",
    password: "admin123" 
};

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    console.log("Login Attempt for:", username); 

    // Username සහ Password පරීක්ෂාව
    if (username === ADMIN_USER.username && password === ADMIN_USER.password) {
        
        // ✅ server.js එකේ තියෙන JWT_SECRET එකම මෙතනත් පාවිච්චි කළ යුතුයි
        // .env එකේ නැත්නම් default එකක් පාවිච්චි කරන්න (නමුත් Railway එකේ මෙය Variable එකක් ලෙස දාන්න)
        const secret = process.env.JWT_SECRET || 'your_super_secret_key_123';

        const token = jwt.sign(
            { username: ADMIN_USER.username }, 
            secret, 
            { expiresIn: '1d' }
        );

        console.log("Login Success! Token Generated.");

        return res.json({
            success: true,
            token: token,
            message: "Login Successful!"
        });
    } else {
        console.log("Login Failed: Invalid Credentials");
        return res.status(401).json({ 
            success: false, 
            message: "Invalid Username or Password!" 
        });
    }
});

module.exports = router;
