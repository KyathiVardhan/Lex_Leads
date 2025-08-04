import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface LoginRequest {
    email: string;
    password: string;
}

interface JwtPayload {
    userName: string;
    role: string;
}

const adminLogin = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
    try {
        console.log("Admin login attempt:", { email: req.body.email });
        
        // get email and password from request body
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        
        // check if the email and password are matching with the given as we have one admin user
        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
            console.log("Admin credentials verified successfully");
            //generate a token
            const accessToken = jwt.sign(
                {userName: "admin", role: "admin"} as JwtPayload, 
                process.env.ACCESS_TOKEN_SECRET!, 
                {expiresIn: "1d"}
            );
            //send the token as the response
            res.status(200).json({
                success: true,
                message: 'Admin Logged in successful',
                accessToken
            });
        }
        else{
            console.log("Admin credentials failed:", { 
                providedEmail: email, 
                expectedEmail: process.env.ADMIN_EMAIL,
                emailMatch: email === process.env.ADMIN_EMAIL,
                passwordMatch: password === process.env.ADMIN_PASSWORD
            });
            res.status(401).json({
                success: false,
                message: "Invalid credentials"
            });
            return;
        }
        
        
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error", 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export default adminLogin; 