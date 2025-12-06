// src/pages/PaymentPendingPage.tsx
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

type PaymentStatus = "pending" | "success" | "failed";

interface PaymentStatusResponse {
  status: PaymentStatus;
  // تقدر تضيف أي حقول ثانية حسب الـ API عندك
  // message?: string;
  // plan?: string;
}

export default function PaymentPendingPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // نقرأ قيمة data من الـ URL: ?data=aa22b1be-e7de-420a-b901-18d7c8024e85
  const searchParams = new URLSearchParams(location.search);
  const paymentId = searchParams.get("data");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRefreshStatus = async () => {
    if (!paymentId) {
      setError("معرف عملية الدفع غير موجود في الرابط.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // ✅ عدّل مسار الـ API حسب مشروعك
      // مثال: GET /api/payments/status?paymentId=...
      const response = await axios.get<PaymentStatusResponse>(
        `/api/payments/status`,
        {
          params: { paymentId },
        }
      );

      const status = response.data.status;

      if (status === "success") {
        // مثال: تحويل لصفحة نجاح الدفع
        navigate(`/payment-success?paymentId=${paymentId}`);
      } else if (status === "failed") {
        // مثال: تحويل لصفحة فشل الدفع
        navigate(`/payment-failed?paymentId=${paymentId}`);
      } else {
        // still pending
        setError("لا تزال عملية الدفع قيد المعالجة، حاول مرة أخرى بعد لحظات.");
      }
    } catch (err) {
      console.error(err);
      setError("حدث خطأ أثناء التحقق من حالة الدفع. حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
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

          {paymentId && (
            <p className="mt-3 text-xs text-slate-400">
              رقم العملية: <span className="font-mono">{paymentId}</span>
            </p>
          )}
        </div>

        {/* تفاصيل العملية */}
        <div className="bg-slate-50 rounded-2xl border border-slate-100 px-4 py-3 mb-4 space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">حالة الدفع</span>
            <span className="inline-flex items-center gap-2 text-amber-600 text-xs font-medium bg-amber-50 px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              قيد المعالجة
            </span>
          </div>
        </div>

        {/* رسالة الخطأ إن وجدت */}
        {error && (
          <div className="mb-4 text-xs text-red-600 bg-red-50 border border-red-100 rounded-2xl px-3 py-2">
            {error}
          </div>
        )}

        {/* الأزرار */}
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRefreshStatus}
            disabled={loading || !paymentId}
            className="w-full py-3 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "جاري التحقق..." : "تحديث حالة الدفع"}
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
