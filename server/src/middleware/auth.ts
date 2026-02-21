import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret-key');

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                name: true,
                email: true,
                githubHandle: true,
                codeforcesHandle: true,
            }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token is invalid or expired' });
    }
};
