'use client'
import React, { useState, useEffect } from 'react';
import { Clock, Info, Wifi, Users, Bed, Coffee, MapPin, Phone, Mail, CheckCircle2, ChevronDown } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  description?: string;
  badge?: string;
  icons?: string[];
  disabled?: boolean;
}

const PaymentMethodOption: React.FC<{
  method: PaymentMethod;
  selected: boolean;
  onSelect: () => void;
}> = ({ method, selected, onSelect }) => (
  <div
    onClick={!method.disabled ? onSelect : undefined}
    className={`border rounded-lg p-4 mb-3 cursor-pointer transition-all ${
      selected ? 'border-sky-500 bg-sky-50' : 'border-gray-200 hover:border-gray-300'
    } ${method.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-sky-500' : 'border-gray-300'
        }`}>
          {selected && <div className="w-3 h-3 rounded-full bg-sky-500" />}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-800">{method.name}</span>
          </div>
          {method.description && (
            <p className="text-sm text-gray-600 mt-1">{method.description}</p>
          )}
        </div>
      </div>
      {method.icons && method.icons.length > 0 && (
        <div className="flex gap-2">
          {method.icons.map((icon, idx) => (
            <div key={idx} className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center text-xs font-semibold text-gray-600">
              {icon}
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default PaymentMethodOption