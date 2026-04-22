const crypto = require("crypto");

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, originalHash] = String(storedHash || "").split(":");

  if (!salt || !originalHash) {
    return false;
  }

  const comparisonHash = crypto.scryptSync(password, salt, 64).toString("hex");
  const originalBuffer = Buffer.from(originalHash, "hex");
  const comparisonBuffer = Buffer.from(comparisonHash, "hex");

  if (originalBuffer.length !== comparisonBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(originalBuffer, comparisonBuffer);
}

module.exports = {
  hashPassword,
  verifyPassword,
};
