import express from "express";
import {
  getAllTickets,
  getNotDoneTickets,
  getBlockedTickets,
  getDoneTickets,
  lockTicket,
  handleTicket,
  skipTicket,
  createTicket,
} from "../controllers/ticketController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();
router.post("/create", authMiddleware, createTicket);
router.get("/", authMiddleware, getAllTickets);
router.get("/not-done", authMiddleware, getNotDoneTickets);
router.get("/blocked", authMiddleware, getBlockedTickets);
router.get("/done", authMiddleware, getDoneTickets);
router.put("/lock/:id", authMiddleware, lockTicket);
router.put("/handle/:id", authMiddleware, handleTicket);
router.put("/skip/:id", authMiddleware, skipTicket);

export default router;
