import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubscribe = (plan: "basic" | "professional" | "enterprise") => {
    const random = Math.random();
    if (random > 0.3) {
      const plans = {
        basic: { name: "الباقة الأساسية", price: "٢٩٩ ريال / شهر" },
        professional: { name: "الباقة الاحترافية", price: "٥٩٩ ريال / شهر" },
        enterprise: { name: "باقة المؤسسات", price: "٩٩٩ ريال / شهر" },
      };
      navigate("/payment-success", { state: plans[plan] });
    } else {
      navigate("/payment-failed");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="text-slate-600 hover:text-slate-800 mb-8 flex items-center gap-1 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>رجوع</span>
        </button>

        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            اختر الباقة المناسبة
          </h2>
          <p className="text-slate-600">خطط مرنة لجميع أحجام الأعمال</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Basic */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                الباقة الأساسية
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">٢٩٩</span>
                <span className="text-sm text-slate-500">ريال / شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-slate-700 flex-1">
              <li>حتى ١٠٠ شحنة شهرياً</li>
              <li>تقارير أساسية</li>
              <li>دعم فني عبر البريد</li>
            </ul>
            <button
              className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all"
              onClick={() => handleSubscribe("basic")}
            >
              اختر الباقة
            </button>
          </div>

          {/* Professional */}
          <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-blue-600 relative transform scale-105 flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              الأكثر شعبية
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                الباقة الاحترافية
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">٥٩٩</span>
                <span className="text-sm text-slate-500">ريال / شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-slate-700 flex-1">
              <li>حتى ٥٠٠ شحنة شهرياً</li>
              <li>تقارير تحليلية متقدمة</li>
              <li>دعم فني ٢٤/٧</li>
              <li>API للتكامل</li>
            </ul>
            <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full justify-center"
              onClick={() => handleSubscribe("professional")}>
              اختر الباقة
            </button>
          </div>

          {/* Enterprise */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                باقة المؤسسات
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">٩٩٩</span>
                <span className="text-sm text-slate-500">ريال / شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-slate-700 flex-1">
              <li>شحنات غير محدودة</li>
              <li>جميع التقارير والتحليلات</li>
              <li>دعم مخصص</li>
            </ul>
            <button
              className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all"
              onClick={() => handleSubscribe("enterprise")}
            >
              اختر الباقة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
