export const bookings = [];

export function addBooking(data) {
    const booking = {
        id: `booking-${Date.now()}`,
        ...data,
        status: "pending",
        createdAt: new Date().toISOString()
    };

    bookings.push(booking);

    return booking;
}