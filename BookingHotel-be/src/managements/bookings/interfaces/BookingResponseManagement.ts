export interface BookingResponseManagement {
    bookingId: number
    userId: number
    hotelName?: string
    hotelAddress?: string
    hotelPhone?:string
    roomTypeId: number
    roomTypeName: string
    checkinDate: Date
    checkoutDate: Date
    guestsCount: number
    bedType:string
    roomName:string
    totalPrice: number
    contactFullName?: string
    contactEmail?: string
    contactPhone?: string
    guestsFullName?: string
    status?: string
    totalPriceUpdate?:number
}