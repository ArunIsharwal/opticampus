import express from "express";
import { getAllIssues } from "../controllers/maintenance.controller.js";

const router = express.Router();

router.get("/get-all-issues", getAllIssues);

export default router;
