import jwt from "jsonwebtoken";
import Issues from "../models/Issues.js";

export const getAllIssues = async (req, res) => {
  try {
    const token = req.cookies.token;
    console.log(token);
    

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY);

    const issues = await Issues.find();

    res.status(200).json({ issues });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching issues",
      error: error.message,
    });
  }
};
