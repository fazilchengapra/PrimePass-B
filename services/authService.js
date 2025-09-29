const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");
const { findOrCreateGoogleUser } = require("./oauth.service");
require('dotenv').config()

exports.loginUser = (res, user) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  res
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .status(200)
    .json({
      message: "Login successful",
      user: { _id: user._id, username: user.username, email: user.email },
    });
};

exports.verifyGoogleUser = async(code) => {
    console.log(code);
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
}
