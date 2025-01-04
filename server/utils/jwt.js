const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, "your_jwt_secret", {
    expiresIn: "30d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, "your_jwt_secret");
};

module.exports = { generateToken, verifyToken };
