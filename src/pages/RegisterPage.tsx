import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { apiClient } from "../lib/axios";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [errors, setErrors] = useState<{
    fullName?: string;
    mobile?: string;
    email?: string;
    terms?: string;
  }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: {
      fullName?: string;
      mobile?: string;
      email?: string;
      terms?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = "الاسم الكامل مطلوب";
    }

    if (!mobile.trim()) {
      newErrors.mobile = "رقم الجوال مطلوب";
    } else {
      // تحقق بسيط لرقم سعودي (تقديري، عدّله حسب الحاجة)
      const saMobileRegex = /^(?:\+?966|0)?5[0-9]{8}$/;
      if (!saMobileRegex.test(mobile.replace(/\s+/g, ""))) {
        newErrors.mobile = "الرجاء إدخال رقم جوال صحيح";
      }
    }

    if (!email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
      }
    }

    if (!termsAccepted) {
      newErrors.terms = "يجب الموافقة على الشروط والأحكام وسياسة الخصوصية";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) return;

    try {
      setIsSubmitting(true);

      // غيّر المسار حسب الباك إند عندك لو مختلف
      await apiClient.post("/user-management/auth/register", {
        fullName,
        mobile,
        email,
        termsAccepted,
      });

      // بعد نجاح التسجيل (وإرسال OTP من الباك إند) نروح لصفحة OTP
      navigate("/otp", { state: { email } });
    } catch (err: any) {
      setServerError(
        err?.response?.data?.message ||
          err.message ||
          "تعذر إنشاء الحساب، الرجاء المحاولة لاحقاً."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
        <button
          type="button"
          onClick={() => navigate("/home")}
          className="mb-6 text-sm text-slate-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>رجوع</span>
        </button>

        <div className="mb-8 text-right">
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">إنشاء حساب جديد</h2>
          <p className="text-sm text-slate-600">أدخل معلوماتك للبدء</p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 text-right">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم الكامل */}
          <div>
            <label
              className="block text-sm font-medium text-slate-700 mb-2 text-right"
              htmlFor="fullName"
            >
              الاسم الكامل
            </label>
            <Input
              id="fullName"
              type="text"
              placeholder="أدخل اسمك الكامل"
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFullName(e.target.value)}
              className={errors.fullName ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.fullName && (
              <p className="mt-1 text-xs text-red-500 text-right">{errors.fullName}</p>
            )}
          </div>

          {/* رقم الجوال */}
          <div>
            <label
              className="block text-sm font-medium text-slate-700 mb-2 text-right"
              htmlFor="mobile"
            >
              رقم الجوال
            </label>
            <Input
              id="mobile"
              type="tel"
              placeholder="+966 5XX XXX XXX"
              value={mobile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMobile(e.target.value)}
              className={errors.mobile ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.mobile && (
              <p className="mt-1 text-xs text-red-500 text-right">{errors.mobile}</p>
            )}
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label
              className="block text-sm font-medium text-slate-700 mb-2 text-right"
              htmlFor="email"
            >
              البريد الإلكتروني
            </label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500 text-right">{errors.email}</p>
            )}
          </div>

          {/* الموافقة على الشروط */}
          <div className="flex items-start gap-2 text-xs text-slate-600">
            <Checkbox
              className="mt-1"
              checked={termsAccepted}
              onCheckedChange={(checked) => setTermsAccepted(!!checked)}
            />
            <span>
              أوافق على{" "}
              <button type="button" className="text-blue-600 hover:text-blue-700">
                الشروط والأحكام
              </button>{" "}
              و{" "}
              <button type="button" className="text-blue-600 hover:text-blue-700">
                سياسة الخصوصية
              </button>
            </span>
          </div>
          {errors.terms && (
            <p className="mt-1 text-xs text-red-500 text-right">{errors.terms}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600">
          لديك حساب بالفعل؟{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="text-blue-600 hover:text-blue-700"
          >
            سجل دخولك
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
