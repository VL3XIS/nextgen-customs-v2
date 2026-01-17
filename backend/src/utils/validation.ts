import { z } from 'zod';

export const signupSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    shopName: z.string().min(2, 'Shop name is required'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

export const jobCreateSchema = z.object({
    vehicle: z.string().min(1, 'Vehicle information is required'),
    customerName: z.string().min(1, 'Customer name is required'),
    customerEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    services: z.string().min(1, 'Services description is required'),
    notes: z.string().optional(),
});
