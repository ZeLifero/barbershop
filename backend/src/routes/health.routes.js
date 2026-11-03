import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({
        success: true,
        status: "OK",
        message: "Gentlemen's Club API is running!",
        timestamp: new Date().toISOString()
    });
});

export default router;