const env = require("../config/env");
const { execute, queryOne } = require("../database/client");
const { hashPassword, verifyPassword } = require("../utils/hash");
const { signToken } = require("../utils/token");

function buildAuthResponse(user) {
  return {
    user: {
      id: user.id,
      email: user.email,
    },
    token: signToken(user.id, env.tokenSecret),
  };
}

function register(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const existingUser = queryOne("SELECT id, email FROM users WHERE email = ?;", [email]);

    if (existingUser) {
      return res.status(409).json({
        message: "User with this email already exists.",
      });
    }

    const now = new Date().toISOString();
    execute(
      `
        INSERT INTO users (email, password_hash, created_at, updated_at)
        VALUES (?, ?, ?, ?);
      `,
      [email, hashPassword(password), now, now]
    );

    const createdUser = queryOne("SELECT id, email FROM users WHERE email = ?;", [email]);

    return res.status(201).json({
      message: "User registered successfully.",
      ...buildAuthResponse(createdUser),
    });
  } catch (error) {
    return next(error);
  }
}

function login(req, res, next) {
  try {
    const email = String(req.body.email || "").trim().toLowerCase();
    const password = String(req.body.password || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const user = queryOne("SELECT * FROM users WHERE email = ?;", [email]);

    if (!user || !verifyPassword(password, user.password_hash)) {
      return res.status(401).json({
        message: "Invalid email or password.",
      });
    }

    return res.json({
      message: "Login successful.",
      ...buildAuthResponse(user),
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
  register,
};
