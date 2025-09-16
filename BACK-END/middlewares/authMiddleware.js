import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ success: false, message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Ensure both id and role are attached
    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

export default auth;
