import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

type State = { name?: string; price?: string };

const PaymentSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as { state?: State };
  const planName = location.state?.name || "الباقة الاحترافية";
  const amount = location.state?.price || "٥٩٩ ريال / شهر";

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-green-600 text-3xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">تم الدفع بنجاح!</h2>
        <p className="text-sm text-slate-600 mb-8">تم تفعيل اشتراكك بنجاح</p>

        <div className="bg-slate-50 rounded-xl p-6 mb-6 text-right">
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
            <span className="text-sm text-slate-500">الباقة</span>
            <span className="text-sm font-medium text-slate-900">{planName}</span>
          </div>
          <div className="flex justify-between items-center mb-3 pb-3 border-b border-slate-200">
            <span className="text-sm text-slate-500">المبلغ المدفوع</span>
            <span className="text-sm font-medium text-slate-900">{amount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-500">رقم العملية</span>
            <span className="text-sm font-medium text-slate-900">#12345678</span>
          </div>
        </div>

        <div className="space-y-3">
          <button className="w-full py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            onClick={() => navigate("/")}>
            الذهاب للصفحة الرئيسية
          </button>
          <button className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all">
            تحميل الفاتورة
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
