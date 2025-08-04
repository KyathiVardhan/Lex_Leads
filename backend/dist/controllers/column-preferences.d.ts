import { Request, Response } from 'express';
interface JwtPayload {
    userId: string;
    userName: string;
    role: string;
}
interface AuthenticatedRequest extends Request {
    userInfo?: JwtPayload;
}
export declare const getColumnPreferences: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export declare const saveColumnPreferences: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=column-preferences.d.ts.map