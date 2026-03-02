const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Getting Header Token 
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        console.log("Access Denied: No Token found in Header");
        return res.status(401).json({ message: "අවසර නැත, Token එකක් නැත!" });
    }

    const token = authHeader.split(' ')[1];

    try {
        
        const decoded = jwt.verify(token, 'your_super_secret_key_123'); 
        
        req.admin = decoded;
        next();
    } catch (err) {
        console.log("JWT Verification Error:", err.message);
        return res.status(401).json({ message: "Token එක වලංගු නැත!" });
    }
};