import { Request, Response, NextFunction } from "express";
interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}
declare const AdminAuthMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export default AdminAuthMiddleware;
//# sourceMappingURL=admin-auth-middleware.d.ts.map