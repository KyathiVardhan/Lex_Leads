import { Request, Response } from 'express';
interface LoginRequest {
    email: string;
    password: string;
}
declare const adminLogin: (req: Request<{}, {}, LoginRequest>, res: Response) => Promise<void>;
export default adminLogin;
//# sourceMappingURL=adminLogin.d.ts.map