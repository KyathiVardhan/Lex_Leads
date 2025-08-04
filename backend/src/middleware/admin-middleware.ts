import { Request, Response, NextFunction } from 'express';

interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}

const isAdminUser = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.userInfo || req.userInfo.role !== 'admin') {
        res.status(403).json({
            success: false,
            message: 'Access denied. You are not authorized to access this resource'
        });
        return;
    }
    next();
}

export default isAdminUser; 