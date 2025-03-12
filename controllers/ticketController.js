import Ticket from "../models/Ticket.js";
import User from "../models/User.js";

export const createTicket = async (req, res) => {
  try {
    const { title, description, comments } = req.body;
    const ticket = new Ticket({
      title,
      description,
      comments,
      status: "open",
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getNotDoneTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ status: { $ne: "done" } });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBlockedTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({
      userId: req.user.id,
      status: "blocked",
    });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDoneTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.user.id, status: "done" });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const lockTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket || ticket.status !== "open") {
      return res.status(400).json({ message: "Ticket not available" });
    }

    ticket.status = "blocked";
    ticket.userId = req.user.id;
    await ticket.save();

    await User.findByIdAndUpdate(req.user.id, {
      $addToSet: { tickets: ticket._id },
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const handleTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (
      !ticket ||
      ticket.status !== "blocked" ||
      !ticket.userId ||
      ticket?.userId?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Ticket not available" });
    }
    ticket.status = "done";
    await ticket.save();
    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const skipTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (
      !ticket ||
      ticket.status !== "blocked" ||
      !ticket.userId ||
      ticket?.userId?.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "Ticket not available" });
    }

    ticket.status = "open";
    ticket.userId = null;
    await ticket.save();

    await User.findByIdAndUpdate(req.user.id, {
      $pull: { tickets: ticket._id },
    });

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
