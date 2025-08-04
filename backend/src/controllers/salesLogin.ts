import { Request, Response } from 'express';
import SalesUser from '../models/SalesUser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

interface LoginRequest {
    email: string;
    password: string;
}

interface JwtPayload {
    userId: string;
    userName: string;
    role: string;
}

const salesLogin = async (req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> => {
    try {
        
        // get email and password from request body
        const {email, password} = req.body;
        
        // Validate input
        if (!email || !password) {
            console.log("Missing email or password");
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }
        
        // Check if user exists with the given email
        const user = await SalesUser.findOne({ email });
        if (!user) {
            console.log("User not found with email");
            res.status(401).json({
                success: false,
                message: "Login failed"
            });
            return;
        }
        console.log("User found");

        // Compare password using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Password mismatch for user");
            res.status(401).json({
                success: false,
                message: "Login failed"
            });
            return;
        }

        // Generate JWT token
        const accessToken = jwt.sign(
            { userId: (user as any)._id.toString(), userName: user.name, role: user.role } as JwtPayload,
            process.env.ACCESS_TOKEN_SECRET!,
            { expiresIn: "1d" }
        );

        res.status(200).json({
            success: true,
            message: "Sales person logged in successful",
            accessToken
        });
        
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error", 
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export default salesLogin; 