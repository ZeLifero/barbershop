
import prisma from "../lib/prisma.js";

export async function getServices(req, res, next) {
    try {
        const services = await prisma.service.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: "asc"
            }
        });

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        next(error);
    }
}
