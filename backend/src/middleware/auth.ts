import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
    user?: {
        userId: string;
    };
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ success: false, error: 'Access denied' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'default_secret'; // Fallback for dev only
        const decoded = jwt.verify(token, secret) as { userId: string };
        req.user = decoded;
        next();
    } catch (error: any) {
        console.error('JWT Verification failed:', error.message);
        console.log('Token received (start):', token.substring(0, 10));
        res.status(403).json({ success: false, error: 'Invalid token: ' + error.message });
    }
};
