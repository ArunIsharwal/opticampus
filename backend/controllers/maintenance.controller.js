
import Issues from "../models/Issues.js";

export const getAllIssues = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.cookie.token, process.env.JWT_SECRET_KEY);

    const issues = await Issues.find();

    if (!issues.length) {
      return res.status(404).json({
        message: "No Issues found for this student",
      });
    }

    res.status(200).json({
      issues,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};
