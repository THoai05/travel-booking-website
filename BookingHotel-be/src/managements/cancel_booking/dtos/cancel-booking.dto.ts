// src/managements/bookings/dtos/cancel-booking.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class CancelBookingDto {
    @IsString()
    @IsNotEmpty()
    reason: string;
}
