const jwt = require("jsonwebtoken");
const { Types } = require("mongoose");

module.exports = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded._id;

    if (!userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    req.user = { _id: new Types.ObjectId(userId) };
    next();
  } catch (err) {
    console.error("JWT Error:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
