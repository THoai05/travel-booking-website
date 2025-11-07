'use client'

import api from "@/axios/axios"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react" // <-- Thêm useState
import { useAppSelector, useAppDispatch } from '@/reduxTK/hook';
import { setPendingBooking } from '@/reduxTK/features/bookingSlice'

const PaymentCheck = () => {

    const params = useSearchParams()
    const router = useRouter()
    const dispatch = useAppDispatch()

    // == Thêm State quản lý UI ==
    // Bắt đầu với trạng thái loading
    const [isLoading, setIsLoading] = useState(true)
    // State để lưu thông báo lỗi
    const [error, setError] = useState(null)
    // State cho thông báo loading
    const [message, setMessage] = useState("Đang xác minh thanh toán của bạn...")

    useEffect(() => {
        const verifyPayment = async () => {
            setIsLoading(true) // Đảm bảo là đang loading
            setError(null) // Xóa lỗi cũ (nếu có)
            
            const queryParam = new URLSearchParams(params.toString())
            const gateway = queryParam.get('gateway')
            let paymentVerifyEndpoint = ''
            queryParam.delete('gateway')
            const cleanQueryString = queryParam ? queryParam.toString() : ''
            const finalQueryString = cleanQueryString ? `?${cleanQueryString}` : ''

            switch (gateway) {
                case "vnpay":
                    paymentVerifyEndpoint = `payment-gate/verify/vnpay${finalQueryString}`
                    break
                case "momo":
                    paymentVerifyEndpoint = `payment-gate/verify/momo${finalQueryString}`
                    break
                case "zalopay":
                    paymentVerifyEndpoint = `payment-gate/verify/zalopay${finalQueryString}`
                    break
                case "stripe":
                    paymentVerifyEndpoint = `payment-gate/verify/stripe${finalQueryString}`
                    break
                default:
                    // Trường hợp không có gateway hợp lệ
                    setError("Cổng thanh toán không được hỗ trợ hoặc không tìm thấy.")
                    setIsLoading(false)
                    return // Dừng thực thi
            }

            console.log(paymentVerifyEndpoint)

            try {
                const response = await api.get(paymentVerifyEndpoint)
                console.log(response.data)

                if (response.data.message === "success") {
                    // Thanh toán thành công
                    setMessage("Thanh toán thành công! Đang chuyển hướng...")
                    dispatch(setPendingBooking(response.data.data))
                    
                    // Thêm một chút delay để user kịp đọc text (tùy chọn)
                    setTimeout(() => {
                        router.replace('/payment/done')
                    }, 1000) 
                } else {
                    // Trường hợp API trả về success nhưng payment lại fail (ví dụ: mã QR hết hạn)
                    throw new Error(response.data.message || "Xác minh thanh toán không thành công.")
                }
            } catch (err) {
                console.log(err)
                // Lấy thông báo lỗi từ response của API nếu có
                const errorMsg = err.response?.data?.message || err.message || "Đã xảy ra lỗi không xác định";
                setError(`Lỗi: ${errorMsg}. Vui lòng liên hệ hỗ trợ.`);
                setIsLoading(false) // Dừng loading để hiển thị lỗi
            }
        }

        // Kiểm tra xem có params không
        if (params.toString()) {
            verifyPayment()
        } else {
            // Nếu không có param nào, đây là truy cập không hợp lệ
            setError("Không tìm thấy thông tin thanh toán. Đường dẫn không hợp lệ.")
            setIsLoading(false)
        }
    }, [params, router, dispatch]) // <-- Thêm dispatch vào dependency array

    // == Giao diện (Render) ==
    return (
        // Dùng flex để căn giữa mọi thứ
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
            
            {/* --- Trạng thái LOADING --- */}
            {isLoading && (
                <>
                    {/* Đây là Spinner (Tailwind) */}
                    <div className="w-16 h-16 border-t-4 border-b-4 border-sky-600 rounded-full animate-spin"></div>
                    
                    {/* Text bro yêu cầu */}
                    <h1 className="text-2xl font-semibold text-gray-800 mt-6">
                        {message}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Vui lòng không tắt hoặc tải lại trang này.
                    </p>
                </>
            )}

            {/* --- Trạng thái ERROR --- */}
            {!isLoading && error && (
                <>
                    {/* Icon lỗi (ví dụ) */}
                    <div className="w-16 h-16 flex items-center justify-center rounded-full bg-red-100 mb-4">
                        <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                    
                    <h1 className="text-2xl font-bold text-red-700">
                        Thanh toán thất bại
                    </h1>
                    <p className="text-gray-600 mt-2 max-w-md">
                        {error}
                    </p>
                    
                    {/* Nút để user quay lại (ví dụ: quay lại trang giỏ hàng) */}
                    <button 
                        onClick={() => router.push('/client')} // Hoặc '/booking'
                        className="mt-6 px-6 py-2 bg-sky-600 text-white rounded-md hover:bg-sky-700 transition-colors"
                    >
                        Quay lại trang chủ
                    </button>
                </>
            )}
        </div>
    )
}

export default PaymentCheck