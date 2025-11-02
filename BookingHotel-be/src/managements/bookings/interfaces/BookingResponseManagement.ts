export interface BookingResponseManagement {
    bookingId: number
    userId: number
    roomTypeId: number
    checkinDate: Date
    checkoutDate: Date
    guestsCount: number
    bedType:string
    roomName:string
    totalPrice: number
    contactFullName?: string
    contactEmail?: string
    contactPhone?: string
    guestsFullName?:string
}