import {
    bookings,
    addBooking
} from "../services/bookings.service.js";

export function getBookings(req, res) {
    res.json({
        success: true,
        count: bookings.length,
        data: bookings
    });
}

export function createBooking(req, res) {
    const {
        clientName,
        phone,
        serviceId,
        masterId,
        dateTime,
        comment
    } = req.body;

    if (
        !clientName ||
        !phone ||
        !serviceId ||
        !masterId ||
        !dateTime
    ) {
        return res.status(400).json({
            success: false,
            message: "Заполните все обязательные поля"
        });
    }

    const booking = addBooking({
        clientName,
        phone,
        serviceId,
        masterId,
        dateTime,
        comment: comment || ""
    });

    res.status(201).json({
        success: true,
        message: "Запись успешно создана",
        data: booking
    });
}