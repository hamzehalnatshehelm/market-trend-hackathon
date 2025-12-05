import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<{ email?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { email?: string } = {};

    if (!email) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "صيغة البريد الإلكتروني غير صحيحة";
      }
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

      // غيّر الرابط حسب الـ API عندك
      const res = await fetch("https://api.example.com/auth/request-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          rememberMe,
        }),
      });

      if (!res.ok) {
        try {
          const errorData = await res.json();
          if (errorData?.message) {
            throw new Error(errorData.message);
          }
        } catch {
          // تجاهل خطأ البودي
        }
        throw new Error("تعذر إرسال رمز التحقق، الرجاء المحاولة لاحقاً.");
      }

      // لو تحتاج تقرأ شيء من الريسبونس:
      // const data = await res.json();

      // بعد نجاح إرسال الـ OTP نروح لصفحة OTP ومعنا الإيميل
      navigate("/otp", { state: { email } });
    } catch (err: any) {
      setServerError(err.message || "حدث خطأ غير متوقع، الرجاء المحاولة لاحقاً.");
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
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">تسجيل الدخول</h2>
          <p className="text-sm text-slate-600">أدخل بريدك الإلكتروني لإرسال رمز التحقق</p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 text-right">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
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

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <label htmlFor="remember" className="text-slate-700 cursor-pointer">
                تذكرني
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال رمز التحقق"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-slate-600">
          ليس لديك حساب؟{" "}
          <button
            type="button"
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-blue-700"
          >
            سجل الآن
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
