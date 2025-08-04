"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            console.log("Admin credentials verified successfully");
            const accessToken = jsonwebtoken_1.default.sign({ userName: "admin", role: "admin" }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
            res.status(200).json({
                success: true,
                message: 'Admin Logged in successful',
                accessToken
            });
        }
        else {
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.default = adminLogin;
//# sourceMappingURL=adminLogin.js.map