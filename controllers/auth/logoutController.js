exports.logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // only https in production
    sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
  });

  return res.json({ success: true, message: "Logged out successfully" });
};