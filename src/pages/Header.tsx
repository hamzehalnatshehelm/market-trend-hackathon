import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

export default function Header() {
  return (
    <header className="container mx-auto px-4 py-8 bg-white border-b shadow-sm py-3 px-6 flex items-center justify-between fixed top-0 left-0 z-50">
      
      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="logo" className="h-10 w-auto" />
        <h1 className="text-xl font-semibold text-gray-700">Market Trends</h1>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
          تسجيل الدخول
        </button>

        <Link
          to="#"
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded-md"
        >
          <MessageCircle className="w-4 h-4" />
          <span>ASK</span>
        </Link>
      </div>
    </header>
  );
}
