const env = require("../config/env");
const { queryOne } = require("../database/client");
const { verifyToken } = require("../utils/token");

function authMiddleware(req, res, next) {
  const header = String(req.headers.authorization || "");
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";

  if (!token) {
    return res.status(401).json({
      message: "Authorization token is missing.",
    });
  }

  const payload = verifyToken(token, env.tokenSecret);

  if (!payload) {
    return res.status(401).json({
      message: "Invalid or expired token.",
    });
  }

  const user = queryOne("SELECT id, email FROM users WHERE id = ?;", [payload.userId]);

  if (!user) {
    return res.status(401).json({
      message: "User for this token was not found.",
    });
  }

  req.user = {
    id: Number(user.id),
    email: user.email,
  };

  return next();
}

module.exports = authMiddleware;
