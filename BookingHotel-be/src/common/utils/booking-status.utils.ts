import { BookingStatus } from "src/managements/bookings/entities/bookings.entity";

export function isValidBooking(value: string): value is BookingStatus{
    return Object.values(BookingStatus).includes(value as BookingStatus)
}