import express from "express";
import {
  getAllEvents,
  updateEventStatus,
} from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/get-all-events", getAllEvents);
router.post("/event/status", updateEventStatus);

export default router;
