import { services } from "../services/services.service.js";

export function getServices(req, res) {
    res.json({
        success: true,
        count: services.length,
        data: services
    });
}