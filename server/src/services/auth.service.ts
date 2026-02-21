import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/prisma';

export class AuthService {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
    private static readonly JWT_EXPIRE = '7d';

    static async register(userData: any) {
        const { email, password, name } = userData;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            throw new Error('User already exists with this email');
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
            },
        });

        return this.generateTokenResponse(user);
    }

    static async login(credentials: any) {
        const { email, password } = credentials;

        // Find user
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            throw new Error('Invalid credentials');
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        return this.generateTokenResponse(user);
    }

    static generateTokenResponse(user: any) {
        const token = jwt.sign({ id: user.id }, this.JWT_SECRET, {
            expiresIn: this.JWT_EXPIRE,
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                githubHandle: user.githubHandle,
                codeforcesHandle: user.codeforcesHandle,
            },
            token,
        };
    }
}
