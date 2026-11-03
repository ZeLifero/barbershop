import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import mastersRoutes from "./routes/masters.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// API routes
app.use("/api/health", healthRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/masters", mastersRoutes);
app.use("/api/bookings", bookingsRoutes);

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

// Start server
app.listen(PORT, () => {
    console.log("------------------------------------");
    console.log(" Gentlemen's Club API");
    console.log(` Server: http://localhost:${PORT}`);
    console.log("------------------------------------");
});