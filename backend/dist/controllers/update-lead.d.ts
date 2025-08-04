import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}
declare const updateLead: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export default updateLead;
//# sourceMappingURL=update-lead.d.ts.map