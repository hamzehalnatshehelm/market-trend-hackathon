import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";

type PlanKey = "basic" | "professional" | "enterprise";

const plansConfig: Record<
  PlanKey,
  {
    name: string;
    price: string;          // مثال: "٢٩٩ ريال / شهر"
    subscriptionId: string; // مثال: "SUB-001"
    features: string[];
  }
> = {
  basic: {
    name: "الباقة الأساسية",
    price: "٢٩٩ ريال / شهر",
    subscriptionId: "SUB-001",
    features: [
      "حتى ١٠٠ استعلام شهرياً",
      "تقارير أساسية",
      "دعم فني عبر البريد",
    ],
  },
  professional: {
    name: "الباقة الاحترافية",
    price: "٥٩٩ ريال / شهر",
    subscriptionId: "SUB-002",
    features: [
      "حتى ٥٠٠ استعلام شهرياً",
      "تقارير شاملة متقدمة",
      "دعم فني ٢٤/٧",
    ],
  },
  enterprise: {
    name: "باقة المؤسسات",
    price: "٩٩٩ ريال / شهر",
    subscriptionId: "SUB-003",
    features: [
      "حتى ١٠٠٠ استعلام شهرياً",
      "جميع التقارير والتحليلات",
      "دعم مخصص",
    ],
  },
};

const SubscriptionPage: React.FC = () => {
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null);

  const handleSubscribe = async (plan: PlanKey) => {
    try {
      setLoadingPlan(plan);

      const payload = {
        name: "Hamzeh Alnatsheh",
        email: "hamzeh.alnatsheh@gmail.com",
        mobile: "+966542874858",
        subscriptionId: plansConfig[plan].subscriptionId,
      };

      const res = await axios.post(
        `/payment/api/payment/create-invoice`,
        payload
      );

      const paymentUrl = res.data?.result?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Payment URL not found in response");
      }

      // ✅ توجيه المستخدم لبوابة الدفع
      window.location.href = paymentUrl;
    } catch (error) {
      console.error("Subscription error:", error);
      navigate("/payment-failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* زر الرجوع */}
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="text-slate-600 hover:text-slate-800 mb-8 flex items-center gap-1 text-sm"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span>رجوع</span>
        </button>

        {/* العنوان */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-semibold text-slate-900 mb-3">
            اختر الباقة المناسبة
          </h2>
          <p className="text-slate-600">خطط مرنة لجميع أحجام الأعمال</p>
        </div>

        {/* الباقات */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* الباقة الأساسية */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {plansConfig.basic.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">
                  {plansConfig.basic.price.split(" ")[0]}
                </span>
                <span className="text-sm text-slate-500">ريال / شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-slate-700 flex-1">
              {plansConfig.basic.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button
              className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all"
              disabled={loadingPlan === "basic"}
              onClick={() => handleSubscribe("basic")}
            >
              {loadingPlan === "basic" ? "جارٍ المعالجة..." : "اختر الباقة"}
            </Button>
          </div>

          {/* الباقة الاحترافية (الأكثر شعبية) */}
          <div className="bg-white rounded-xl shadow-2xl p-6 border-2 border-blue-600 relative transform scale-105 flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              الأكثر شعبية
            </div>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {plansConfig.professional.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">
                  {plansConfig.professional.price.split(" ")[0]}
                </span>
                <span className="text-sm text-slate-500">ريال / شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-slate-700 flex-1">
              {plansConfig.professional.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full justify-center"
              disabled={loadingPlan === "professional"}
              onClick={() => handleSubscribe("professional")}
            >
              {loadingPlan === "professional"
                ? "جارٍ المعالجة..."
                : "اختر الباقة"}
            </Button>
          </div>

          {/* باقة المؤسسات */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-slate-200 flex flex-col">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {plansConfig.enterprise.name}
              </h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-4xl font-bold text-slate-900">
                  {plansConfig.enterprise.price.split(" ")[0]}
                </span>
                <span className="text-sm text-slate-500">ريال / شهر</span>
              </div>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-slate-700 flex-1">
              {plansConfig.enterprise.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
            <Button
              className="w-full py-3 rounded-lg text-sm font-medium bg-gray-100 text-slate-900 hover:bg-gray-200 transition-all"
              disabled={loadingPlan === "enterprise"}
              onClick={() => handleSubscribe("enterprise")}
            >
              {loadingPlan === "enterprise"
                ? "جارٍ المعالجة..."
                : "اختر الباقة"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
