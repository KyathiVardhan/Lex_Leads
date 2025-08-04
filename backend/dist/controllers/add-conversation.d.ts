import { Request, Response } from 'express';
interface AuthRequest extends Request {
    userInfo?: {
        userId: string;
        userName: string;
        role: string;
    };
}
export declare const addConversation: (req: AuthRequest, res: Response) => Promise<void>;
export declare const getConversationsByLead: (req: AuthRequest, res: Response) => Promise<void>;
export {};
//# sourceMappingURL=add-conversation.d.ts.map