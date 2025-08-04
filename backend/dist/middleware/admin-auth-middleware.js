"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const AdminAuthMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: "No token provided"
        });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            res.status(401).json({
                success: false,
                message: "Unauthorized of Invalid token..",
                error: "Invalid token"
            });
            return;
        }
        req.userInfo = {
            userName: decoded.userName,
            role: decoded.role
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized of Invalid token..",
        });
        return;
    }
};
exports.default = AdminAuthMiddleware;
//# sourceMappingURL=admin-auth-middleware.js.map