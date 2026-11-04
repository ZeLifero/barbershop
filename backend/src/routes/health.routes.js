
import { Router } from "express";
import prisma from "../lib/prisma.js";

const router = Router();

// Проверка работы API
router.get("/", (req, res) => {
    res.json({
        success: true,
        status: "OK",
        message: "Gentlemen's Club API is running!",
        timestamp: new Date().toISOString()
    });
});

// Проверка подключения к PostgreSQL через Prisma
router.get("/db", async (req, res) => {
    try {
        const servicesCount = await prisma.service.count();

        res.json({
            success: true,
            database: "connected",
            message: "PostgreSQL connection is working!",
            servicesCount
        });
    } catch (error) {
        console.error("Database check failed:", error);

        res.status(500).json({
            success: false,
            database: "disconnected",
            message: "Database connection failed"
        });
    }
});

export default router;
