import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}
declare const getLeads: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export default getLeads;
//# sourceMappingURL=get-leads.d.ts.map