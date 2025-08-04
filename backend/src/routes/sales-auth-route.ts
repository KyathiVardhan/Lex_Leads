import express, { Request, Response } from "express";
import salesLogin from "../controllers/salesLogin";
import SalesAuthMiddleware from "../middleware/sales-auth-middleware";

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}

const router = express.Router();

router.post("/login", salesLogin);

// Welcome endpoint for sales users
router.get("/welcome-sales", SalesAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome! You are authenticated as a sales person.",
        user: req.userInfo
    });
});

export default router; 