import { Router } from "express";
import {
    createBooking,
    getBookings
} from "../controllers/bookings.controller.js";

const router = Router();

router.get("/", getBookings);
router.post("/", createBooking);

export default router;