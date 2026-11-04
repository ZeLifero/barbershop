
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./lib/prisma.js";
import path from "path";
import { fileURLToPath } from "url";

import healthRoutes from "./routes/health.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import mastersRoutes from "./routes/masters.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const frontendPath = path.resolve(__dirname, "../../frontend");

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/health", healthRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/masters", mastersRoutes);
app.use("/api/bookings", bookingsRoutes);
// Раздача frontend
app.use(express.static(frontendPath));

// Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Маршрут не найден"
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера"
    });
});

prisma.$connect()
    .then(() => {
        console.log("PostgreSQL connected successfully!");
    })
    .catch((error) => {
        console.error("Database connection failed:", error);
    });

// Start server
app.listen(PORT, () => {
    console.log("------------------------------------");
    console.log(" Gentlemen's Club API");
    console.log(` Server: http://localhost:${PORT}`);
    console.log("------------------------------------");
});