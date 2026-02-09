import Event from "../models/Event.js";

export const getAllEvents = async (req, res) => {
  try {
    const { userId } = jwt.verify(req.cookie.token, process.env.JWT_SECRET_KEY);

    const issues = await Event.find();

    if (!events.length) {
      return res.status(404).json({
        message: "No events found for this student",
      });
    }

    res.status(200).json({
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching events",
      error: error.message,
    });
  }
};
