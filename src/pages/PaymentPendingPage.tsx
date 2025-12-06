// src/pages/PaymentPendingPage.tsx
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PaymentPendingPage() {
  const navigate = useNavigate();

  const handleRefreshStatus = () => {
    // هنا تقدر تنادي API يفحص حالة الدفع
    // أو بس تعيد تحميل الصفحة مؤقتاً
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate("/"); // عدّل المسار حسب مشروعك
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-50 px-4"
      dir="rtl"
    >
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">
        {/* الأيقونة */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center border border-amber-200">
            <Clock className="w-8 h-8 text-amber-500" />
          </div>
        </div>

        {/* العنوان والنص */}
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold text-slate-900 mb-2">
            جارٍ معالجة الدفع
          </h1>
          <p className="text-sm text-slate-500">
            نقوم الآن بالتحقق من عملية الدفع الخاصة بك. قد يستغرق ذلك بضع دقائق.
            يمكنك البقاء على هذه الصفحة أو العودة لاحقاً.
          </p>
        </div>

        {/* تفاصيل العملية */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-3 mb-6 space-y-3 text-sm">

          <div className="flex items-center justify-between">
            <span className="text-slate-500">حالة الدفع</span>
            <span className="inline-flex items-center gap-2 text-amber-600 text-xs font-medium bg-amber-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              قيد المعالجة
            </span>
          </div>
        </div>

        {/* الأزرار */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRefreshStatus}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer"
          >
            تحديث حالة الدفع
          </button>

          <button
            type="button"
            onClick={handleGoHome}
            className="w-full py-3 rounded-lg border border-slate-300 text-slate-800 text-sm font-medium bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            الذهاب إلى الصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
}
