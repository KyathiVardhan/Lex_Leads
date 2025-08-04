import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface JwtPayload {
    userName: string;
    role: string;
}

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}

const AdminAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
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
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
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

    } catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized of Invalid token..",
        });
        return;
    }
};

export default AdminAuthMiddleware; 