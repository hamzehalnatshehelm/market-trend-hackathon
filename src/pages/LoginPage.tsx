import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { apiClient } from "../lib/axios";
import { useToast } from "../components/ui/use-toast";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const [errors, setErrors] = useState<{ email?: string }>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();


  const validate = () => {
    const newErrors: { email?: string } = {};

    if (!email.trim()) {
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

      const res = await apiClient.post("/user-management/auth/request-otp", {
        email
      });

      // هنا الريسبونس عندك حسب كلامك: "OTP sent to email"
      console.log("request-otp response:", res.data);

      // تقدر لو حاب تعرض نفس رسالة السيرفر:
      // alert(res.data);
      // أو تخليها عربية ثابتة:
      toast({
        title: "✨ تم الإرسال بنجاح",
        description: "تم إرسال رمز التحقق إلى بريدك الإلكتروني",
      });

      navigate("/otp", { state: { email } });
    } catch (error: any) {
      console.error("request-otp error:", error);
      setServerError(
        error?.response?.data?.message ||
        error.message ||
        "تعذر إرسال رمز التحقق، الرجاء المحاولة لاحقاً."
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
          <h2 className="text-2xl font-semibold text-slate-900 mb-2">تسجيل الدخول</h2>
          <p className="text-sm text-slate-600">أدخل بريدك الإلكتروني لإرسال رمز التحقق</p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-right">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <Input
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
            <label className="flex items-center gap-2">
              <Checkbox
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(!!checked)}
              />
              <span className="text-slate-700">تذكرني</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg w-full justify-center disabled:opacity-60"
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
