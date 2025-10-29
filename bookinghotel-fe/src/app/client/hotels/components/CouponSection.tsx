'use client';

import React, { useState } from 'react';
import { Copy, Info, AlertTriangle } from 'lucide-react';
import { useHandleRandomCouponByTitle } from '@/service/coupon/couponService';
import Image from 'next/image';

// Định nghĩa interface cho dữ liệu API trả về
interface ApiCoupon {
  id: number;
  code: string;
  discountType: 'fixed' | 'percent';
  discountValue: string;
}

// Danh sách các tab thanh toán
const paymentTabs = [
  { key: 'vnpay', display: 'VNPay',imageUrl:'/coupon/vnpay.png' },
  { key: 'momo', display: 'Momo' ,imageUrl: '/coupon/momo.png'},
  { key: 'zalopay', display: 'Zalo Pay',imageUrl:'/coupon/zalopay.png' },
  { key: 'stripe', display: 'Stripe', imageUrl:'/coupon/stripe.png'},
];

// --- Component Skeleton Card ---
// Tôi thêm nó ở đây cho tiện, bro có thể tách ra file riêng nếu muốn
const CouponSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 relative overflow-hidden animate-pulse">
    {/* Icon */}
    <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>

    {/* Title */}
    <div className="h-5 bg-gray-200 rounded-md w-3/4 mb-2"></div>

    {/* Description */}
    <div className="h-4 bg-gray-200 rounded-md w-full mb-1"></div>
    <div className="h-4 bg-gray-200 rounded-md w-5/6 mb-4"></div>

    {/* Coupon Code Box */}
    <div className="flex items-center justify-between bg-gray-100 rounded-lg p-3">
      <div className="flex items-center gap-2">
        <div className="bg-gray-200 rounded w-6 h-6" />
        <div className="h-5 bg-gray-200 rounded-md w-24"></div>
      </div>
      <div className="h-8 bg-gray-200 rounded-lg w-20"></div>
    </div>
  </div>
);
// ------------------------------

export default function CouponSection() {
  const [activeTab, setActiveTab] = useState(paymentTabs[0].key);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTabObject,setActiveTabObject] = useState(paymentTabs[0])

  const {
    data: apiCoupons,
    isLoading,
    isError,
  } = useHandleRandomCouponByTitle(activeTab);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getCouponDisplayData = (coupon: ApiCoupon) => {
    let title = '';
    let description = `Mã giảm giá cho thanh toán qua ${activeTab.toUpperCase()}.`;

    if (coupon.discountType === 'percent') {
      title = `Giảm ${coupon.discountValue}%`;
    } else {
      const amount = Number(coupon.discountValue);
      title = `Giảm ${amount.toLocaleString('vi-VN')} VND`;
    }
    return { title, description };
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Mã giảm cho bạn</h2>
      <p className="text-sm text-gray-600 mb-6">Chỉ áp dụng trên App!</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {paymentTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => {
              setActiveTabObject(tab)
              setActiveTab(tab.key)
            }}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.key
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab.display}
          </button>
        ))}
      </div>

      {/* Hiển thị Loading / Error / Data */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading && (
          // Render 3 skeleton vì bro nói API trả về 3 record
          <>
            <CouponSkeleton />
            <CouponSkeleton />
            <CouponSkeleton />
          </>
        )}

        {isError && (
          // Đặt thông báo lỗi trong một cột để không làm vỡ layout
          <div className="col-span-full text-red-600">
            Không thể tải mã giảm giá. Vui lòng thử lại.
          </div>
        )}

        {!isLoading &&
          !isError &&
          apiCoupons &&
          apiCoupons.map((coupon: ApiCoupon) => {
            const { title, description } = getCouponDisplayData(coupon);

            return (
              <div
                key={coupon.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"
              >
                {/* Icon */}
              <div className="flex items-center gap-4">
    {/* Icon */}
    <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <Image
    src={activeTabObject.imageUrl || '/coupon/coupon.jpg'}
    alt={activeTabObject.imageUrl ? `${activeTabObject.imageUrl} Logo` : 'Fallback Logo'}
    width={48}
    height={48}
    className="w-full h-full object-contain"
    onError={(e) => {
      e.currentTarget.src = '/coupon/coupon.jpg'
    }}
  />
    </div>

    {/* Content */}
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
        {title}
        <Info className="w-4 h-4 text-gray-400" />
      </h3>

      <p className="text-sm text-gray-600 line-clamp-2">
        {description}
      </p>
    </div>
  </div> {/* Coupon Code */}
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3 mt-10">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-200 border-2 border-dashed rounded w-6 h-6" />
                    <code className="font-mono text-sm font-semibold text-gray-800">
                      {coupon.code}
                    </code>
                  </div>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-sky-600 text-white text-xs font-medium rounded-lg hover:bg-sky-700 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode === coupon.code ? 'Đã copy!' : 'Copy'}
                  </button>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}