"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SalesUser_1 = __importDefault(require("../models/SalesUser"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const salesLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            console.log("Missing email or password");
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        const user = await SalesUser_1.default.findOne({ email });
        if (!user) {
            console.log("User not found with email");
            res.status(401).json({
                success: false,
                message: "Login failed"
            });
            return;
        }
        console.log("User found");
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user");
            res.status(401).json({
                success: false,
                message: "Login failed"
            });
            return;
        }
        const accessToken = jsonwebtoken_1.default.sign({ userId: user._id.toString(), userName: user.name, role: user.role }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
        res.status(200).json({
            success: true,
            message: "Sales person logged in successful",
            accessToken
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.default = salesLogin;
//# sourceMappingURL=salesLogin.js.map