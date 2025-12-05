import { Link } from 'react-router-dom';
import { ArrowUpRight, MessageCircle } from 'lucide-react';

interface HeaderProps {
  onAskClick: () => void;
  // حالة المستخدم
  isAuthenticated: boolean;
  isSubscribed: boolean; // true = دافع ومشترك
}

export default function Header({ onAskClick, isAuthenticated, isSubscribed }: HeaderProps) {
  // هل نظهر زر "اشترك الآن"؟
  const showSubscribeButton = !isAuthenticated || (isAuthenticated && !isSubscribed);

  // إلى أين يذهب زر "اشترك الآن"؟
  const subscribeTarget = !isAuthenticated ? '/login' : '/pricing'; // غيّر /pricing لمسار صفحة الاشتراك عندك

  return (
    <header className="mb-8">
      <div className="flex items-center justify-between mb-4 bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center gap-3">
          <div className="flex justify-center">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md">
              <ArrowUpRight className="w-9 h-9" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-semibold mb-1 text-indigo-600">اتجاهات السوق</h1>
            <p className="text-sm text-slate-600">نظام تحليل الشحنات التجارية</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={onAskClick}
            className="flex items-center gap-2 px-6 py-3 cursor-pointer rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all hover:shadow-xl border border-slate-300 bg-white"
          >
            <MessageCircle className="w-5 h-5" />
            <span>إسالني</span>
          </button>

          {showSubscribeButton && (
            <Link
              to={subscribeTarget}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="btn-text">اشترك الآن</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
