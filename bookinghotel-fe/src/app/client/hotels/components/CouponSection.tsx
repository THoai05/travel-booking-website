'use client';

import React, { useState } from 'react';
import { Copy, Info, AlertTriangle } from 'lucide-react';

interface Coupon {
  code: string;
  title: string;
  description: string;
  badge?: 'Only a few left!' | 'Out of stock';
  badgeColor?: 'yellow' | 'red';
}

const coupons: Coupon[] = [
  {
    code: 'VIVUQUOCTE',
    title: 'Up to 500K off international',
    description: '2% off min 5 million VND & 3 nights. 1% off up to 300k min 5...',
    badge: 'Only a few left!',
    badgeColor: 'yellow',
  },
  {
    code: 'KSCUOCTUANVN',
    title: 'Up to 500K off domestic',
    description: '3% off, booking from 2 rooms or 3 nights, min 2 mil. 1% off min 2 mil',
  },
  {
    code: 'KSCUOCTUANDNA',
    title: 'Up to 500K off Southeast Asia',
    description: '3% off, booking from 2 rooms or 3 nights, min 3.5 mil. 1% off min 3.5...',
    badge: 'Out of stock',
    badgeColor: 'red',
  },
];

export default function CouponSection() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const getBadgeStyles = (color: 'yellow' | 'red') => {
    return color === 'yellow'
      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
      : 'bg-red-100 text-red-800 border-red-300';
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 font-sans">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Mã giảm cho bạn</h2>
      <p className="text-sm text-gray-600 mb-6">Chỉ áp dụng trên App!</p>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['Mã giảm hot', 'Ngân hàng', 'Zalo Pay', 'Điểm đến hot'].map((tab) => (
          <button
            key={tab}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              tab === 'Mã giảm hot'
                ? 'bg-sky-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Coupon Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 relative overflow-hidden"
          >
            {/* Badge */}
            {coupon.badge && (
              <div
                className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold border ${getBadgeStyles(
                  coupon.badgeColor!
                )} flex items-center gap-1`}
              >
                {coupon.badgeColor === 'yellow' ? (
                  <AlertTriangle className="w-3 h-3" />
                ) : null}
                {coupon.badge}
              </div>
            )}

            {/* Icon */}
            <div className="w-12 h-12 bg-sky-900 rounded-lg flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </div>

            {/* Title */}
            <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
              {coupon.title}
              <Info className="w-4 h-4 text-gray-400" />
            </h3>

            {/* Description */}
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {coupon.description}
            </p>

            {/* Coupon Code */}
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
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
                {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}