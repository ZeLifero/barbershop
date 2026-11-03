import { masters } from "../services/masters.service.js";

export function getMasters(req, res) {
    res.json({
        success: true,
        count: masters.length,
        data: masters
    });
}