const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


const auth = (req, res, next) => {
const token = req.header('Authorization')?.replace('Bearer ', '');
if (!token) return res.status(401).json({ message: 'No token, authorization denied' });
try {
const decoded = jwt.verify(token, process.env.JWT_SECRET);
req.user = decoded; // contains id and role
next();
} catch (err) {
res.status(401).json({ message: 'Token is not valid' });
}
};


// role-based guard
const permit = (...allowed) => (req, res, next) => {
const { role } = req.user;
if (allowed.includes(role)) return next();
return res.status(403).json({ message: 'Forbidden: insufficient rights' });
};


module.exports = { auth, permit };