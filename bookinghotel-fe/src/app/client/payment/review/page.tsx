"use client";

// --- 1. IMPORT THÊM ---

import React, { useState, useEffect, useMemo } from "react";

import {
  Mail,
  User,
  Star,
  Users,
  Bed,
  Calendar,
  Info,
  ChevronDown,
  Wifi,
  Shield,
  AlertCircle,
  Tag,
  CheckCircle2,
  MapPin,
  Coffee,
  Phone,
  Loader2,
  Checkbox
} from "lucide-react";

import HotelSummaryCard from "./components/HotelSummaryCard";

import PriceDetailsSection from "./components/PriceDetailSection";

// --- Import Redux, Auth, và tools ---

import { useAppSelector, useAppDispatch } from "@/reduxTK/hook";

// --- FIX: Bỏ import thunk ---

import { selectBooking } from "@/reduxTK/features/bookingSlice";

import { selectSearch } from "@/reduxTK/features/searchSlice";

import { useAuth } from "@/context/AuthContext"; // <-- Giả sử đường dẫn này đúng

import { useRouter } from "next/navigation";

import { format, differenceInCalendarDays, parseISO } from "date-fns";
import api from "@/axios/axios";
import { setPendingBooking ,fetchBookingById } from '@/reduxTK/features/bookingSlice'

// --- (Các types của bro giữ nguyên) ---

interface BookingForm {
  fullName: string;

  mobileNumber: string;

  countryCode: string;

  email: string;

  bookingForMyself: boolean;
}

interface GuestForm {
  fullName: string;
}

interface SpecialRequest {
  id: string;

  label: string;

  checked: boolean;
}



interface FormErrors { // <-- THÊM TYPE NÀY
  fullName?: string;
  mobileNumber?: string;
  email?: string;
  guestFullName?: string;
}
// ... (Các types HotelDetails, GuestDetails nếu có thì bro xóa đi) ...

// --- (Các sub-components của bro giữ nguyên: InputField, PhoneInput, Checkbox, Section) ---

const InputField: React.FC<{
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  type?: string;
  helper?: string;
  error?: string; // <-- THÊM PROP NÀY
}> = ({
  label,
  placeholder,
  value,
  onChange,
  required,
  type = "text",
  helper,
  error, // <-- LẤY PROP NÀY
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
      {required && "*"}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
        error ? "border-red-500" : "border-gray-300" // <-- BORDER ĐỎ
      }`}
    />
    {helper && !error && ( // <-- Ẩn helper nếu có lỗi
      <p className="text-xs text-gray-500 mt-1">{helper}</p>
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>} {/* HIỆN LỖI */}
  </div>
);

const PhoneInput: React.FC<{
  countryCode: string;
  phoneNumber: string;
  onCountryChange: (code: string) => void;
  onPhoneChange: (phone: string) => void;
  error?: string; // <-- THÊM PROP NÀY
}> = ({ countryCode, phoneNumber, onCountryChange, onPhoneChange, error }) => ( // <-- LẤY PROP NÀY
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Số điện thoại
    </label>
    <div className="flex gap-2">
      <input
        type="tel"
        value={phoneNumber}
        onChange={(e) => onPhoneChange(e.target.value)}
        className={`flex-1 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none ${
          error ? "border-red-500" : "border-gray-300" // <-- BORDER ĐỎ
        }`}
      />
    </div>
    {!error && ( // <-- Ẩn helper nếu có lỗi
      <p className="text-xs text-gray-500 mt-1">VD:081922121</p>
    )}
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>} {/* HIỆN LỖI */}
  </div>
  );

  const Checkbox: React.FC<{
  checked: boolean;

  onChange: (checked: boolean) => void;

  label: string;
}> = ({ checked, onChange, label }) => (
  <label className="flex items-center gap-2 cursor-pointer">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 text-sky-600 rounded border-gray-300 focus:ring-2 focus:ring-sky-500"
    />

    <span className="text-gray-700">{label}</span>
  </label>
);

const Section: React.FC<{
  icon: React.ReactNode;

  title: string;

  children: React.ReactNode;

  className?: string;
}> = ({ icon, title, children, className = "" }) => (
  <div className={`bg-white rounded-lg shadow-sm p-6 ${className}`}>
    <div className="flex items-center gap-3 mb-4">
      <div className="text-gray-700">{icon}</div>

      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
    </div>

    {children}
  </div>
);

// --- XÓA MOCK DATA: hotelDetails, guestDetails ---

// Main Component

const TravelokaBookingPage: React.FC = () => {

  const dispatch = useAppDispatch();

   useEffect(() => {
  const bookingIdStr = sessionStorage.getItem("activeBookingId");
  if (bookingIdStr) {
    const bookingId = Number(bookingIdStr);
    dispatch(fetchBookingById(bookingId));
  }
}, [dispatch]);
  // --- 2. LẤY DATA TỪ CÁC NGUỒN ---
  const [errors, setErrors] = useState<FormErrors>({});
  

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    // 1. Validate Contact Form
    if (!bookingForm.fullName.trim()) {
      newErrors.fullName = "Họ và tên là bắt buộc.";
    }
    if (!bookingForm.email.trim()) {
      newErrors.email = "Email là bắt buộc.";
    } else if (!/\S+@\S+\.\S+/.test(bookingForm.email)) { // Check format email
      newErrors.email = "Email không hợp lệ.";
    }
    if (!bookingForm.mobileNumber.trim()) {
      newErrors.mobileNumber = "Số điện thoại là bắt buộc.";
    } else if (!/^0\d{9}$/.test(bookingForm.mobileNumber)) { // Check 10 số, bắt đầu bằng 0
      newErrors.mobileNumber = "Số điện thoại phải đúng 10 số (VD: 0912345678).";
    }

    // 2. Validate Guest Form
    if (!guestForm.fullName.trim()) {
      newErrors.guestFullName = "Họ và tên khách là bắt buộc.";
    }

    setErrors(newErrors);
    // Trả về true nếu không có lỗi (Object.keys(newErrors).length === 0)
    return Object.keys(newErrors).length === 0;
  };

  const router = useRouter();

  // Nguồn 1: AuthContext

  const { user } = useAuth(); // Data: { userWithoutPassword: { ... } }

  // Nguồn 2: BookingSlice (Data đơn hàng)

  // --- FIX: Bỏ `isLoading`, `error` vì đây là Happy Case ---

  const { pendingBooking } = useAppSelector(selectBooking);

  // Nguồn 3: SearchSlice (Data số khách - có thể dùng)

  const { guests: searchGuests } = useAppSelector(selectSearch);

  // --- 3. STATE CHO FORM (Được pre-fill từ AuthContext) ---

  const [bookingForm, setBookingForm] = useState<BookingForm>({
    fullName: "", // Sẽ pre-fill ở useEffect

    mobileNumber: "", // Sẽ pre-fill ở useEffect

    countryCode: "+84",

    email: "", // Sẽ pre-fill ở useEffect

    bookingForMyself: false,
  });

  const [guestForm, setGuestForm] = useState<GuestForm>({
    fullName: "", // Mặc định rỗng
  });

  const [specialRequests, setSpecialRequests] = useState<SpecialRequest[]>([
    { id: "non-smoking", label: "Non-smoking Room", checked: false },

    { id: "connecting", label: "Connecting Rooms", checked: false },

    { id: "high-floor", label: "High Floor", checked: false },
  ]);

  // --- 4. LOGIC XỬ LÝ (Handlers + Logic F5 + Pre-fill) ---

  // --- FIX: Bỏ `useEffect` logic F5 (Thunk) ---

  // useEffect(() => {

  //   if (!pendingBooking && !isLoading) { ... }

  // }, [pendingBooking, isLoading, dispatch, router]);

  // Logic Pre-fill: Điền form "Contact" từ AuthContext

  useEffect(() => {
    if (user) {
      setBookingForm((prev) => ({
        ...prev,

        fullName: user.fullName || "",

        mobileNumber: user.phone || "",

        email: user.email || "",
      }));
    }
  }, [user]); // Chạy khi 'user' được load

  // Logic Checkbox: "Guest" = "Contact"

  useEffect(() => {
    if (bookingForm.bookingForMyself) {
      setGuestForm({ fullName: bookingForm.fullName });
    }
  }, [bookingForm.bookingForMyself, bookingForm.fullName]);

  const toggleRequest = (id: string) => {
    setSpecialRequests((requests) =>
      requests.map((req) =>
        req.id === id ? { ...req, checked: !req.checked } : req
      )
    );
  };

  const updateBookingForm = (
    field: keyof BookingForm,
    value: string | boolean
  ) => {
    setBookingForm((prev) => ({ ...prev, [field]: value }));
    // Xóa lỗi khi người dùng nhập
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };



  // --- 5. TẠO PROPS TỪ DATA THẬT (Thay thế Mock Data) ---

  // Helper format ngày

  const formatDate = (dateString: string) => {
    try {
      // parseISO vì date của bro là "2025-11-10"

      return format(parseISO(dateString), "EEE, dd MMMM yyyy");
    } catch {
      return dateString;
    }
  };

  // Props cho HotelSummaryCard

  const hotelDetailsProps = useMemo(() => {

   
    if (!pendingBooking) return null;

    // Đảm bảo tính toán nights > 0

    let nights = 1;

    try {
      nights = differenceInCalendarDays(
        parseISO(pendingBooking.checkoutDate),

        parseISO(pendingBooking.checkinDate)
      );

      if (nights <= 0) nights = 1; // Fallback
    } catch {}

    return {
      bookingId: pendingBooking.bookingId.toString(),

      name: pendingBooking.hotelName, // <-- Bro nói text cứng

      checkIn: formatDate(pendingBooking.checkinDate),

      checkOut: formatDate(pendingBooking.checkoutDate),

      nights: nights,

      roomType: pendingBooking.roomName,

      guests: pendingBooking.guestsCount, // Lấy từ booking

      // guests: searchGuests.adults + searchGuests.children, // Hoặc lấy từ search

      bedType: pendingBooking.bedType,

      breakfast: false, // <-- Bro nói text cứng

      wifi: true, // <-- Bro nói text cứng
    };
  }, [pendingBooking]);



  // Props cho GuestDetails (trong HotelSummaryCard)

  const guestDetailsProps = useMemo(() => {
    // FIX: Check `user` và `user.userWithoutPassword`

    if (!user) return null; // Lấy từ user đăng nhập

    return {
      name: user.fullName,

      phone: user.phone,

      email: user.email,

      nonRefundable: true, // <-- Bro nói text cứng

      nonReschedulable: true, // <-- Bro nói text cứng
    };
  }, [user]);

  // Props cho PriceDetailsSection

  const priceDetailsProps = useMemo(() => {
    if (!pendingBooking) return null;

    return {
      totalPrice: pendingBooking.totalPrice,

      // ... (thêm các chi tiết giá khác nếu cần)
    };
  }, [pendingBooking]);

  // --- 6. XỬ LÝ LOADING / ERROR ---

  // --- FIX: Loading state đã đơn giản hóa cho "Happy Case" ---

  // Chỉ check xem 3 nguồn data chính đã sẵn sàng chưa

  

  if (
    !pendingBooking ||
    !user ||
    !hotelDetailsProps ||
    !guestDetailsProps ||
    !priceDetailsProps
  ) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-sky-500 animate-spin" />

        <p className="mt-4 text-lg text-gray-700">
          Đang tải chi tiết đơn hàng...
        </p>
      </div>
    );
  }

  // --- FIX: Bỏ `if (error)` block (vì không dùng thunk) ---

  // --- 7. RENDER COMPONENT VỚI DATA THẬT ---

 const handleGuestNameChange = (v: string) => {
    setGuestForm({ fullName: v });
    if (errors.guestFullName) {
      setErrors((prev) => ({ ...prev, guestFullName: "" }));
    }
  };

  // ... (toggleRequest, formatDate, ...props) ...
  
  // --- 6. XỬ LÝ LOADING / ERROR ---
  
  // ... (if loading ... ) ...

  // --- 7. RENDER COMPONENT VỚI DATA THẬT ---

  const handlePaymentCheckout = async () => {
    // --- BƯỚC 1: VALIDATE TRƯỚC KHI GỬI ---
    if (!validate()) {
      return; // Dừng lại nếu validate thất bại
    }

    // --- BƯỚC 2: LOGIC GỬI API (giữ nguyên) ---
    try {
      const response = await api.patch(`bookings/${pendingBooking.bookingId}`, {
        contactFullName: bookingForm.fullName,
        contactEmail: bookingForm.email,
        contactPhone: bookingForm.mobileNumber,
        guestsFullName: guestForm.fullName,
      });
      if (response.data.message === "success") {
         const bookingData = response.data.updateData
      dispatch(setPendingBooking(bookingData))

      // 2. LƯU VÀO SESSION (Chỉ ID)
      sessionStorage.setItem('activeBookingId', bookingData.bookingId.toString())

      // 3. Chuyển trang
      router.push('/payment/checkout')
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (Giữ nguyên) */}

      <header className="bg-white shadow-sm border-b mt-15">
        {/* ... (Code header của bro) ... */}

        {/* Tui sẽ thêm code header mẫu vì nó bị thiếu */}

        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-sky-600 font-bold text-2xl">Bluevera</div>

              <div className="w-6 h-6 bg-sky-500 rounded-full"></div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-sky-500 text-white rounded-full flex items-center justify-center font-bold">
                  1
                </div>

                <span className="text-sky-600 font-semibold">Kiểm tra</span>
              </div>

              <div className="text-gray-300">—</div>

              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 text-gray-500 rounded-full flex items-center justify-center font-bold">
                  2
                </div>

                <span className="text-gray-500">Thanh toán</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hotel Info Bar (Data thật) */}

   
      {/* Main Content */}

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Logged in Banner (Data thật) */}

      

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Forms (Đã pre-fill) */}

          <div className="lg:col-span-2 space-y-6">
            {/* Booking Contact */}

           <Section icon={<Mail size={20} />} title="Liên hệ đơn hàng">
              {/* ... (p tag) ... */}
              <InputField
                label="Họ và tên"
                placeholder=""
                value={bookingForm.fullName}
                onChange={(v) => updateBookingForm("fullName", v)}
                required
                helper="VD: Hà Công Hậu"
                error={errors.fullName} // <-- TRUYỀN LỖI XUỐNG
              />
              <div className="grid md:grid-cols-2 gap-4">
                <PhoneInput
                  countryCode={bookingForm.countryCode}
                  phoneNumber={bookingForm.mobileNumber}
                  onCountryChange={(v) => updateBookingForm("countryCode", v)}
                  onPhoneChange={(v) => updateBookingForm("mobileNumber", v)}
                  error={errors.mobileNumber} // <-- TRUYỀN LỖI XUỐNG
                />
                <InputField
                  label="Email"
                  type="email"
                  placeholder="e.g. email@example.com"
                  value={bookingForm.email}
                  onChange={(v) => updateBookingForm("email", v)}
                  required
                  error={errors.email} // <-- TRUYỀN LỖI XUỐNG
                />
              </div>
                <div className="mt-4">
                <Checkbox
                  checked={bookingForm.bookingForMyself}
                  onChange={(v) => updateBookingForm("bookingForMyself", v)}
                  label="Đặt phòng cho chính tôi"
                />
              </div>
            </Section>

            {/* Guest Detail (Đã pre-fill bằng logic "useEffect") */}

            <Section icon={<User size={20} />} title="Thông tin chi tiết khách hàng">
              {/* ... (p tag) ... */}
              <InputField
                label="Họ và tên"
                placeholder=""
                value={guestForm.fullName}
                onChange={handleGuestNameChange} // <-- DÙNG HANDLER MỚI
                required
                helper="VD:Hà Công Hậu"
                error={errors.guestFullName} // <-- TRUYỀN LỖI XUỐNG
              />
            </Section>

            {/* Special Request (Giữ nguyên) */}

            <Section icon={<AlertCircle size={20} />} title="Special Request">
              {/* ... (Code special request của bro) ... */}

              <p className="text-sm text-gray-600 mb-4">
                Tất cả các yêu cầu đặc biệt đều phụ thuộc vào tình trạng sẵn có và do đó không được đảm bảo.
                Việc nhận phòng sớm hoặc đưa đón sân bay có thể phát sinh phụ phí.
                Vui lòng liên hệ trực tiếp với nhân viên khách sạn để biết thêm thông tin chi tiết
              </p>

              <div className="grid md:grid-cols-3 gap-4">
                {specialRequests.map((request) => (
                  <Checkbox
                    key={request.id}
                    checked={request.checked}
                    onChange={() => toggleRequest(request.id)}
                    label={request.label}
                  />
                ))}
              </div>

              <button className="text-sky-600 hover:text-sky-700 font-semibold mt-3 text-sm">
               Đọc thêm
              </button>
            </Section>
          </div>

          {/* Right Column - Room Summary (Data thật) */}

          <div className="lg:col-span-1">
            <HotelSummaryCard
              hotel={hotelDetailsProps}
              guest={guestDetailsProps}
            />

            <PriceDetailsSection
              price={priceDetailsProps.totalPrice}
              onclick={handlePaymentCheckout}// <-- Pass prop vào
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelokaBookingPage;
