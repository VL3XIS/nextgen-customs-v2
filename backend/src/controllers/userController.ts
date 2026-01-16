import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import prisma from '../config/database';

interface AuthRequest extends Request {
    user?: { userId: string };
}

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { shopName } = req.body;

        if (!shopName) return res.status(400).json({ success: false, error: 'Shop name is required' });

        const user = await prisma.user.update({
            where: { id: userId },
            data: { shopName, updatedAt: new Date() }
        });

        res.json({ success: true, user: { id: user.id, email: user.email, shopName: user.shopName } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error updating profile' });
    }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, error: 'Both current and new passwords are required' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ success: false, error: 'User not found' });

        const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isMatch) return res.status(400).json({ success: false, error: 'Incorrect current password' });

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(newPassword, salt);

        await prisma.user.update({
            where: { id: userId },
            data: { passwordHash, updatedAt: new Date() }
        });

        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error changing password' });
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.userId;
        await prisma.user.delete({ where: { id: userId } });
        res.json({ success: true, message: 'Account deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Error deleting account' });
    }
};
