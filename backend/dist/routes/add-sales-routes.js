"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const admin_auth_middleware_1 = __importDefault(require("../middleware/admin-auth-middleware"));
const admin_middleware_1 = __importDefault(require("../middleware/admin-middleware"));
const sales_auth_middleware_1 = __importDefault(require("../middleware/sales-auth-middleware"));
const SalesUser_1 = __importDefault(require("../models/SalesUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = express_1.default.Router();
router.get("/welcome-sales", sales_auth_middleware_1.default, (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome! You are authenticated as a sales person.",
        user: req.userInfo
    });
});
router.post("/add-sales", admin_auth_middleware_1.default, admin_middleware_1.default, async (req, res) => {
    try {
        console.log("Received request to add sales user:", req.body);
        const { name, email, password, role } = req.body;
        if (!name || !email || !password || !role) {
            console.log("Missing required fields");
            res.status(400).json({
                success: false,
                message: "All fields (name, email, password, role) are required"
            });
            return;
        }
        const existingUser = await SalesUser_1.default.findOne({ email });
        if (existingUser) {
            console.log("User already exists with email");
            res.status(400).json({
                success: false,
                message: "User with this email already exists"
            });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newSalesUser = new SalesUser_1.default({
            name,
            email,
            password: hashedPassword,
            role
        });
        await newSalesUser.save();
        console.log("Sales user created successfully");
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
    }
    catch (error) {
        console.error("Error adding sales user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=add-sales-routes.js.map