import prisma from "../lib/prisma.js";

export async function getBookings(req, res, next) {
    try {
        const bookings = await prisma.booking.findMany({
            include: {
                client: true,
                service: true,
                master: true
            },
            orderBy: {
                dateTime: "asc"
            }
        });

        res.json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        next(error);
    }
}

export async function createBooking(req, res, next) {
    try {
        const {
            clientName,
            phone,
            serviceId,
            masterId,
            dateTime,
            comment
        } = req.body;

        // Проверяем обязательные поля
        if (
            !clientName?.trim() ||
            !phone?.trim() ||
            !serviceId ||
            !masterId ||
            !dateTime
        ) {
            return res.status(400).json({
                success: false,
                message: "Заполните все обязательные поля"
            });
        }

        // Проверяем дату и время
        const bookingDate = new Date(dateTime);

        if (
            Number.isNaN(bookingDate.getTime()) ||
            bookingDate <= new Date()
        ) {
            return res.status(400).json({
                success: false,
                message: "Выберите корректную дату и время в будущем"
            });
        }

        // Проверяем существование услуги
        const service = await prisma.service.findFirst({
            where: {
                id: serviceId,
                isActive: true
            }
        });

        if (!service) {
            return res.status(404).json({
                success: false,
                message: "Услуга не найдена или недоступна"
            });
        }

        // Проверяем существование мастера
        const master = await prisma.master.findFirst({
            where: {
                id: masterId,
                isActive: true
            }
        });

        if (!master) {
            return res.status(404).json({
                success: false,
                message: "Мастер не найден или недоступен"
            });
        }

        // Рассчитываем время окончания записи
        const bookingEnd = new Date(
            bookingDate.getTime() + service.duration * 60 * 1000
        );

        // Проверяем, не занят ли мастер в это время
        const existingBookings = await prisma.booking.findMany({
            where: {
                masterId,
                status: {
                    in: ["PENDING", "CONFIRMED"]
                },
                dateTime: {
                    lt: bookingEnd
                }
            },
            include: {
                service: true
            }
        });

        const hasConflict = existingBookings.some((existing) => {
            const existingEnd = new Date(
                existing.dateTime.getTime() +
                existing.service.duration * 60 * 1000
            );

            return (
                existing.dateTime < bookingEnd &&
                existingEnd > bookingDate
            );
        });

        if (hasConflict) {
            return res.status(409).json({
                success: false,
                message: "Это время уже занято. Выберите другое"
            });
        }

        // Ищем клиента по номеру телефона
        const normalizedPhone = phone.trim();

        let client = await prisma.client.findFirst({
            where: {
                phone: normalizedPhone
            }
        });

        // Если клиента ещё нет — создаём
        if (client) {
            client = await prisma.client.update({
                where: {
                    id: client.id
                },
                data: {
                    name: clientName.trim()
                }
            });
        } else {
            client = await prisma.client.create({
                data: {
                    name: clientName.trim(),
                    phone: normalizedPhone
                }
            });
        }

        // Создаём запись
        const booking = await prisma.booking.create({
            data: {
                clientId: client.id,
                serviceId,
                masterId,
                dateTime: bookingDate,
                comment: comment?.trim() || null,
                priceAtBooking: service.price
            },
            include: {
                client: true,
                service: true,
                master: true
            }
        });

        res.status(201).json({
            success: true,
            message: "Запись успешно создана",
            data: booking
        });

    } catch (error) {
        next(error);
    }
}