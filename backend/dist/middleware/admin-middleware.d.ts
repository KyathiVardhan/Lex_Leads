import { Request, Response, NextFunction } from 'express';
interface AuthenticatedRequest extends Request {
    userInfo?: {
        userName: string;
        role: string;
    };
}
declare const isAdminUser: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export default isAdminUser;
//# sourceMappingURL=admin-middleware.d.ts.map