import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}
declare const addLeadsToSales: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export default addLeadsToSales;
//# sourceMappingURL=add-lead.d.ts.map