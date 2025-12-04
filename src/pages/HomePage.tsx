import React from "react";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: "#4F46E5" }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* خط الترند الصاعد */}
              <path d="M3 17l6-6 4 4 8-8" />
              {/* زاوية السهم */}
              <path d="M14 7h7v7" />
            </svg>
          </div>
        </div>

        {/* Title + subtitle */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">اتجاهات السوق</h1>
          <p className="text-sm text-slate-600">نظام إدارة الشحن والتصدير</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          {/* تسجيل الدخول - زر أساسي بنفسجي */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-lg text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            تسجيل الدخول
          </button>

          {/* إنشاء حساب جديد - رمادي مثل الصورة */}
          <button
            type="button"
            onClick={() => navigate("/subscription")}
            className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all"
          >
            إنشاء حساب جديد
          </button>
        </div>

        {/* قسم توضيحي في الأسفل مثل الكرت الصغير في الصورة */}
        <div className="mt-8 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#4F46E5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 17l4-8 4 6 4-10 4 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                تقارير تحليلية متقدمة
              </p>
              <p className="text-xs text-slate-500">
                احصل على رؤية شاملة ومفصلة لجميع عمليات الشحن
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
