import express from "express";
import adminLogin from "../controllers/adminLogin";

const router = express.Router();

router.post("/login", adminLogin);

export default router; 