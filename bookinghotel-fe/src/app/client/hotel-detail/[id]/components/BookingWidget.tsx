'use client'

import { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar, Users } from 'lucide-react';

interface BookingWidgetProps {
  price: number;
  rating: number;
  reviewCount: number;
}

export default function BookingWidget({ price, rating, reviewCount }: BookingWidgetProps) {
  const [nights, setNights] = useState(1);

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-end justify-between">
          <div>
            <span className="text-gray-500">From</span>
            <div className="flex items-baseline gap-2">
              <span className="text-blue-600">${price}</span>
              <span className="text-gray-500 text-sm">/night</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-yellow-400">★</span>
              <span>{rating}</span>
            </div>
            <span className="text-sm text-gray-500">{reviewCount} reviews</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="check-in">Check-in</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="check-in"
                type="date"
                className="pl-10"
                defaultValue="2025-10-25"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="check-out">Check-out</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="check-out"
                type="date"
                className="pl-10"
                defaultValue="2025-10-26"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="guests">Guests</Label>
          <div className="relative">
            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Select defaultValue="2">
              <SelectTrigger id="guests" className="pl-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Guest</SelectItem>
                <SelectItem value="2">2 Guests</SelectItem>
                <SelectItem value="3">3 Guests</SelectItem>
                <SelectItem value="4">4 Guests</SelectItem>
                <SelectItem value="5">5+ Guests</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="pt-4 border-t space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>${price} × {nights} night{nights > 1 ? 's' : ''}</span>
            <span>${price * nights}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Service fee</span>
            <span>${Math.round(price * nights * 0.1)}</span>
          </div>
          <div className="flex justify-between pt-3 border-t">
            <span>Total</span>
            <span>${price * nights + Math.round(price * nights * 0.1)}</span>
          </div>
        </div>

        <Button className="w-full">Reserve Now</Button>
        <p className="text-center text-sm text-gray-500">
          You won't be charged yet
        </p>
      </CardContent>
    </Card>
  );
}
