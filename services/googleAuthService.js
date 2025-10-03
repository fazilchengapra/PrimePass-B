const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");
require("dotenv").config();

const findOrCreateGoogleUser = async ({ email, name, sub }) => {
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

exports.verifyGoogleUser = async (code) => {
  const client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "postmessage"
  );

  const { tokens } = await client.getToken(code);
  const idToken = tokens.id_token;

  // 2. Verify the ID token to get user details
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload) throw new Error("Invalid token payload");
  const user = await findOrCreateGoogleUser(payload);
  return user;
};