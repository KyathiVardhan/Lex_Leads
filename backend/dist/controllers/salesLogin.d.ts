import { Request, Response } from 'express';
interface LoginRequest {
    email: string;
    password: string;
}
declare const salesLogin: (req: Request<{}, {}, LoginRequest>, res: Response) => Promise<void>;
export default salesLogin;
//# sourceMappingURL=salesLogin.d.ts.map