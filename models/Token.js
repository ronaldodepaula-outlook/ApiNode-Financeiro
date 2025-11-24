const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema(
  {
    token: { type: String, required: true, unique: true },
    // expiresAt stores the exact expiry datetime; we create a TTL index with expireAfterSeconds: 0
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// Ensure TTL index on expiresAt (documents will be removed when expiresAt <= now)
TokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Token', TokenSchema);
