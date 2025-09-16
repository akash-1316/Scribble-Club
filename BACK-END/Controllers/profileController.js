import User from "../models/User.js";
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password -refreshToken");
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📌 Update profile (name, bio, picture)
const updateProfile = async (req, res) => {
  try {
    const { name, bio } = req.body;
    let updateData = { name, bio };

    if (req.file) {
      updateData.profilePic = req.file.path.replace(/\\/g, "/");
    }

    const user = await User.findByIdAndUpdate(req.user.id, updateData, { new: true }).select(
      "-password -refreshToken"
    );

    res.json({ success: true, message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export { getProfile, updateProfile };
