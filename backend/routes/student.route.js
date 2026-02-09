import express from "express";
import {
  createEvent,
  createIssue,
  getEventsByStudentId,
} from "../controllers/student.controller.js";

const router = express.Router();

router.post("/create-event", createEvent);
router.post("/create-issue", createIssue);
router.get("/get-events", getEventsByStudentId);

export default router;
