import { Request, Response } from "express";
interface AuthenticatedRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}
declare const getCustomLeadTypes: (req: AuthenticatedRequest, res: Response) => Promise<void>;
export default getCustomLeadTypes;
//# sourceMappingURL=get-custom-lead-types.d.ts.map