import express, { Request, Response } from "express";
import AdminAuthMiddleware from "../middleware/admin-auth-middleware";
import isAdminUser from "../middleware/admin-middleware";
import SalesAuthMiddleware from "../middleware/sales-auth-middleware";
import SalesUser from "../models/SalesUser";
import bcrypt from "bcryptjs";


interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}

interface AddSalesRequest {
    name: string;
    email: string;
    password: string;
    role: string;
}

const router = express.Router();

// Sales welcome endpoint for authenticated sales users
router.get("/welcome-sales", SalesAuthMiddleware, (req: AuthenticatedRequest, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome! You are authenticated as a sales person.",
        user: req.userInfo
    });
});



router.post("/add-sales", AdminAuthMiddleware, isAdminUser, async (req: Request<{}, {}, AddSalesRequest>, res: Response) => {
    try {
        console.log("Received request to add sales user:", req.body);
        const { name, email, password, role } = req.body;
        
        // Validate required fields
        if (!name || !email || !password || !role) {
            console.log("Missing required fields:", { name: !!name, email: !!email, password: !!password, role: !!role });
            res.status(400).json({
                success: false,
                message: "All fields (name, email, password, role) are required"
            });
            return;
        }

        // Check if user already exists
        const existingUser = await SalesUser.findOne({ email });
        if (existingUser) {
            console.log("User already exists with email:", email);
            res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
            return;
        }

        // Create new sales user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newSalesUser = new SalesUser({
            name,
            email,
            password: hashedPassword,
            role
        });

        await newSalesUser.save();
        console.log("Sales user created successfully:", { id: newSalesUser._id, name: newSalesUser.name, email: newSalesUser.email });

        res.status(201).json({
            success: true,
            message: "Sales user added successfully",
            data: {
                id: newSalesUser._id,
                name: newSalesUser.name,
                email: newSalesUser.email,
                role: newSalesUser.role
            }
        });

    } catch (error) {
        console.error("Error adding sales user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

export default router; 