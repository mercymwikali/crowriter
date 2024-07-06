const jwt = require("jsonwebtoken");
const verifyJwt = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized Access" });
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Forbidden", error: err.message });
    }

    req.user = decoded.user;
    next();
  });
};

const adminRoute = (req, res, next) => {
  if (req.user && req.user.role === "ADMIN") {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized Access" });
  }
};

module.exports = { verifyJwt, adminRoute };
