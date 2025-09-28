const User = require("../models/User");
exports.findOrCreateGoogleUser = async ({ email, name, sub }) => {
  const user = await User.findOneAndUpdate(
    { email },
    {
      $set: {
        username: name,
        email, // Ensure email is set on creation
        provider: "google",
        providerId: sub,
      },
    },
    {
      upsert: true,
      new: true,
    }
  );

  return user;
};
