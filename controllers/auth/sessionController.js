const User = require("../../models/User");

exports.isMe = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res.json({ loggedIn: false });
    }

    // Fetch user (exclude password)
    const user = await User.findById(req.user.id).select(
      "_id username email role"
    );

    if (!user) {
      return res.json({ loggedIn: false });
    }

    return res.json({
      loggedIn: true,
      user,
    });
  } catch (err) {
    console.error("isMe error:", err);
    return res.status(500).json({ loggedIn: false, message: "Server error" });
  }
};