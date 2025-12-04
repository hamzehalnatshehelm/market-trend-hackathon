import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const PaymentFailedPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-red-600 text-3xl">✕</span>
        </div>
        <h2 className="text-2xl font-semibold text-slate-900 mb-2">فشلت عملية الدفع</h2>
        <p className="text-sm text-slate-600 mb-8">لم تتم عملية الدفع بنجاح</p>

        <div className="bg-red-50 rounded-xl p-6 mb-6 text-right">
          <p className="text-sm font-medium text-red-900 mb-3">أسباب محتملة:</p>
          <ul className="text-sm text-red-700 space-y-2">
            <li>رصيد غير كافٍ</li>
            <li>بيانات البطاقة غير صحيحة</li>
            <li>انتهت صلاحية البطاقة</li>
            <li>تم رفض العملية من البنك</li>
          </ul>
        </div>

        <div className="space-y-3">
          <button className="w-full py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
            onClick={() => navigate("/subscription")}>
            حاول مرة أخرى
          </button>
          <button
            className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all"
            onClick={() => navigate("/home")}
          >
            العودة للصفحة الرئيسية
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailedPage;
