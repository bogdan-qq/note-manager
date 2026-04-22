const crypto = require("crypto");

const TOKEN_TTL_MS = 1000 * 60 * 60 * 24 * 7;

function createSignature(payload, secret) {
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

function signToken(userId, secret) {
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${userId}:${expiresAt}`;
  const signature = createSignature(payload, secret);
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

function verifyToken(token, secret) {
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const [userId, expiresAt, signature] = decoded.split(":");

    if (!userId || !expiresAt || !signature) {
      return null;
    }

    const payload = `${userId}:${expiresAt}`;
    const expectedSignature = createSignature(payload, secret);

    if (expectedSignature !== signature) {
      return null;
    }

    if (Number(expiresAt) < Date.now()) {
      return null;
    }

    return {
      userId: Number(userId),
      expiresAt: Number(expiresAt),
    };
  } catch (error) {
    return null;
  }
}

module.exports = {
  signToken,
  verifyToken,
};
