import express from "express";
import { getAllEvents } from "../controllers/staff.controller.js";

const router = express.Router();

router.get("/get-all-issues", getAllEvents);

export default router;
