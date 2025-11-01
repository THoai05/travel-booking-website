import { Menu, User, Heart, Bell } from 'lucide-react';
import { Button } from './ui/button';

export default function Navbar() {
  return (
    <nav className="border-b bg-white sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-8">
            <h1 className="text-blue-600">StayHub</h1>
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                Hotels
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                Resorts
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                Villas
              </a>
              <a href="#" className="text-gray-700 hover:text-blue-600 transition">
                Apartments
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Heart className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" className="hidden md:flex items-center gap-2">
              <User className="w-4 h-4" />
              Sign In
            </Button>
            <Button className="hidden md:block">Register</Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
