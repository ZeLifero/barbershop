
import prisma from "../lib/prisma.js";

export async function getMasters(req, res, next) {
    try {
        const masters = await prisma.master.findMany({
            where: {
                isActive: true
            },
            orderBy: {
                name: "asc"
            }
        });

        res.json({
            success: true,
            count: masters.length,
            data: masters
        });
    } catch (error) {
        next(error);
    }
}
