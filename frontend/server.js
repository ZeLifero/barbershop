import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

import healthRoutes from "./routes/health.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import mastersRoutes from "./routes/masters.routes.js";
import bookingsRoutes from "./routes/bookings.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Определяем расположение текущего файла
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Путь к frontend
const frontendPath = path.resolve(__dirname, "../../frontend");

import fs from "fs";

console.log("Frontend path:", frontendPath);
console.log("Frontend exists:", fs.existsSync(frontendPath));
console.log(
    "Index exists:",
    fs.existsSync(path.join(frontendPath, "index.html"))
);

app.use(cors());
app.use(express.json());

// API-маршруты
app.use("/api/health", healthRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/masters", mastersRoutes);
app.use("/api/bookings", bookingsRoutes);

// Раздача frontend
app.use(express.static(frontendPath));
console.log("Frontend directory:", frontendPath);
console.log("Index file:", path.join(frontendPath, "index.html"));
// Главная страница
app.get("/", (req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
});

// Обработка неизвестных маршрутов
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Маршрут не найден"
    });
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err);

    res.status(500).json({
        success: false,
        message: "Внутренняя ошибка сервера"
    });
});

app.listen(PORT, () => {
    console.log("------------------------------------");
    console.log(" Gentlemen's Club");
    console.log(` Server: http://localhost:${PORT}`);
    console.log(` Frontend: ${frontendPath}`);
    console.log("------------------------------------");
});