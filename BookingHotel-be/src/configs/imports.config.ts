import { AmenitiesModule } from "src/managements/amenities/modules/amenities.module";
import { AuthModule } from "src/managements/auth/modules/auth.module";
import { BookingsModule } from "src/managements/bookings/modules/bookings.module";
import { CityModule } from "src/managements/city/modules/city.module";
import { CouponsModule } from "src/managements/coupons/modules/coupons.module";
import { FavouritesModule } from "src/managements/favourite/modules/favourite.module";
import { HotelStaffModule } from "src/managements/hotel_staff/modules/hotel_staff.module";
import { HotelsModule } from "src/managements/hotels/modules/hotels.module";
import { NotificationsModule } from "src/managements/notifications/modules/notifications.module";
import { PaymentsModule } from "src/managements/payments/modules/payments.module";
import { PostsModule } from "src/managements/posts/posts.module";
import { PromotionModule } from "src/managements/promotion/modules/promotion.module";
import { ReviewsModule } from "src/managements/reviews/modules/reviews.module";
import { RoomsModule } from "src/managements/rooms/modules/rooms.module";
import { SupportChatModule } from "src/managements/support_chat/modules/support_chat.module";
import { UsersModule } from "src/managements/users/modules/users.module";
import { BookingModuleAbout } from "src/managements/about/module/booking.module";
import { RevenueModule } from "src/managements/about/module/revenue.module";

export const ManagementsImports = [
    AmenitiesModule,
    AuthModule,
    CouponsModule,
    FavouritesModule,
    HotelStaffModule,
    HotelsModule,
    NotificationsModule,
    PaymentsModule,
    PromotionModule,
    ReviewsModule,
    RoomsModule,
    SupportChatModule,
    UsersModule,
    CityModule,
    BookingsModule,
    BookingModuleAbout,
    RevenueModule,
    PostsModule
]