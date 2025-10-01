module.exports = {
  //
  async up(db, client) {
    await db.collection("users").updateMany(
      { provider: { $exists: false } },
      {
        $set: {
          provider: "local",
          providerId: null,
          isVerified: true,
          otp: null,
          otpExpires: null,
          otpAttempts: 0,
          otpLockedUntil: null,
        },
      }
    );
  },
};
