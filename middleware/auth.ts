import { Request, Response, NextFunction, } from 'express';
import jwt from "jsonwebtoken"
import dotenv from 'dotenv';

dotenv.config();

const PUBLIC_KEY = process.env.PUBLIC_KEY as string;
console.log(PUBLIC_KEY, "public key");

// Middleware to verify token
export function authenticateToken(req: any, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token, "token");
        if (!token) return res.sendStatus(401);

        jwt.verify(token, PUBLIC_KEY, { algorithms: ['RS256'] }, (err: any, user: any) => {
            if (err) {
                console.log(err);
                return res.sendStatus(403);
            }
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
    }
}
