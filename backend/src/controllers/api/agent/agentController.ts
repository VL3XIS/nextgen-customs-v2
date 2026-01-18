import { Request, Response } from 'express';
import prisma from '../../../config/database';

// Public endpoint for Voice Agent to create a lead
export const createAgentLead = async (req: Request, res: Response) => {
    try {
        console.log('Voice Agent Lead Request:', req.body);
        const { customerName, vehicle, serviceInterest, phoneNumber } = req.body;

        // Basic validation
        if (!customerName || !vehicle) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: customerName or vehicle"
            });
        }

        // Create a "Lead" Job (Status: PENDING)
        // Since the agent is public, we assign it to a default admin user (or finding the first user)
        // In a real multi-tenant app, we'd need an API Key in the headers to identify the shop.
        // For this MVP demo, we will assign it to the first user found in the DB.

        const defaultUser = await prisma.user.findFirst();

        if (!defaultUser) {
            return res.status(500).json({ success: false, message: "No shop owner found to assign lead." });
        }

        const newLead = await prisma.job.create({
            data: {
                userId: defaultUser.id,
                customerName: customerName,
                vehicle: vehicle,
                status: 'PENDING', // PENDING serves as "inquiry"
                notes: `Lead from Voice Agent.\nPhone: ${phoneNumber || 'N/A'}\nInterest: ${serviceInterest || 'General'}`,
                services: serviceInterest || 'Consultation',
                estimatedValue: 0
            }
        });

        console.log('Lead Created:', newLead.id);

        return res.json({
            success: true,
            message: `Appointment request logged for ${vehicle}. Shop has been notified.`,
            leadId: newLead.id
        });

    } catch (error) {
        console.error('Agent Lead Error:', error);
        return res.status(500).json({ success: false, message: "Server error processing lead." });
    }
};

// Public endpoint for Voice Agent to check status
export const checkVehicleStatus = async (req: Request, res: Response) => {
    try {
        const { vehicle, customerName } = req.body;
        console.log('Voice Agent Status Check:', { vehicle, customerName });

        if (!vehicle && !customerName) {
            return res.status(400).json({
                success: false,
                message: "Please provide a vehicle model or customer name to search."
            });
        }

        const whereClause: any = {};
        if (vehicle) whereClause.vehicle = { contains: vehicle, mode: 'insensitive' };
        if (customerName) whereClause.customerName = { contains: customerName, mode: 'insensitive' };

        const jobs = await prisma.job.findMany({
            where: whereClause,
            take: 3,
            orderBy: { updatedAt: 'desc' },
            select: { vehicle: true, status: true, customerName: true, services: true }
        });

        if (jobs.length === 0) {
            return res.json({
                success: true,
                found: false,
                message: "I couldn't find a vehicle matching those details in our active shop system."
            });
        }

        const job = jobs[0]; // Take the most relevant one

        // Map status to natural language
        const statusMap: Record<string, string> = {
            'PENDING': 'is currently pending approval and intake.',
            'IN_PROGRESS': 'is currently on the shop floor being worked on.',
            'COMPLETED': 'is fully finished and ready for pickup!',
            'CANCELLED': 'was cancelled.'
        };

        const naturalStatus = statusMap[job.status] || `is currently marked as ${job.status}.`;

        return res.json({
            success: true,
            found: true,
            message: `I found the ${job.vehicle} for ${job.customerName}. It ${naturalStatus} The services listed are: ${job.services}.`
        });

    } catch (error) {
        console.error('Agent Status Error:', error);
        return res.status(500).json({ success: false, message: "Server error checking status." });
    }
};
