import express from "express";
import contactRoutes from "./contacts.js";
import authRoutes from "./auth.js";

const router = express.Router();
router.use("/auth", authRoutes);
router.use("/contacts", contactRoutes);

export default router;
