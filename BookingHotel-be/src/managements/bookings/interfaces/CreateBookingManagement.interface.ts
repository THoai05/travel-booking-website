interface CreateBookingManagement {
    bookingId: number
    userId: number
    roomTypeId: number
    checkinDate: Date
    checkoutDate: Date
    guestsCount: number
    bedType:string
    roomName:string
    totalPrice:number
}