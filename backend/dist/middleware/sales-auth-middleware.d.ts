import { Request, Response, NextFunction } from 'express';
interface JwtPayload {
    userId: string;
    userName: string;
    role: string;
}
interface AuthenticatedRequest extends Request {
    userInfo?: JwtPayload;
}
declare const SalesAuthMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<void>;
export default SalesAuthMiddleware;
//# sourceMappingURL=sales-auth-middleware.d.ts.map