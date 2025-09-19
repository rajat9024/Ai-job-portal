
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
  const token = req.header('Authorization')?.replace('Bearer ','');
  if(!token) return res.status(401).json({ msg:'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
   
    req.user = decoded.user || decoded;
   
    next();
  } catch(err) {
    console.error("JWT verify error:", err);
    res.status(401).json({ msg:'Invalid token' });
  }
}
