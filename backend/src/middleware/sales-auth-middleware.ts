import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
    userId: string;
    userName: string;
    role: string;
}

interface AuthenticatedRequest extends Request {
    userInfo?: JwtPayload;
}

const SalesAuthMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: "Access token is required"
            });
            return;
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix
        
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload;
        
        // Add user info to request object
        req.userInfo = decoded;
        
        next();
    } catch (error) {
        console.error("Sales auth middleware error:", error);
        res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
        return;
    }
};

export default SalesAuthMiddleware; 