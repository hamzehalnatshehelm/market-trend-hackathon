import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../lib/axios";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/use-toast";

interface OtpLocationState {
  state?: { email?: string, name?: string, mobileNumber?: string };
}

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as OtpLocationState;
  const { login } = useAuth();
  const email = location.state?.email || "";
  const mobileNumber = location.state?.mobileNumber || "";
  const name = location.state?.name || "";

  const [values, setValues] = useState(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!email) navigate("/login");
  }, [email, navigate]);

  const handleChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;

    const next = [...values];
    next[index] = value;
    setValues(next);
    setError(null);

    if (value && index < inputsRef.current.length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !values[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setServerError(null);

    const otp = values.join("");

    if (otp.length !== 6) {
      setError("الرجاء إدخال رمز التحقق بالكامل (6 أرقام).");
      return;
    }

    try {
      setIsSubmitting(true);

      // 1️⃣ التحقق من OTP
      const res = await apiClient.post("/user-management/auth/verify-otp", {
        email,
        otp
      });

      const data = res.data;
debugger
      if (data.token) {
        login(data.token, email);

        toast({
          title: "تم التحقق بنجاح!",
        });
        navigate("/subscription");
      } else {
        // 2️⃣ استدعاء API التسجيل مباشرة بدون توكن
        try {
          const registerRes = await apiClient.post("/user-management/api/register", {
            email,
            name,
            mobileNumber,
            // لو عندك حقول أخرى ضيفها:
            // planId,
          });

          console.log("register response:", registerRes.data);
        } catch (registerError: any) {
          console.error("register error:", registerError);
          setServerError(
            registerError?.response?.data?.message ||
            "حدث خطأ أثناء إنشاء الحساب."
          );
          return; // نوقف لأن التسجيل فشل
        }

        // 3️⃣ رسالة نجاح
        toast({
          title: "🎉 تم التحقق والتسجيل بنجاح!",
        });

        // 4️⃣ نتقل للخطوة التالية
        navigate("/login");
      }
    } catch (error: any) {
      console.error("verify-otp error:", error);
      setServerError(
        error?.response?.data?.message ||
        error.message ||
        "رمز التحقق غير صحيح أو منتهي."
      );
    } finally {
      setIsSubmitting(false);
    }

  };


  const resendOtp = async () => {
    setError(null);
    setServerError(null);

    try {
      const res = await apiClient.post("/user-management/auth/request-otp", { email });

      console.log("resend-otp response:", res.data);

      // لو الريسبونس "OTP sent to email"
      // نقدر نعرضه للمستخدم أو نخليها رسالة عربية:
      // alert(res.data);
      // alert("تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني!");
      toast({
        title: "✨ تم الإرسال بنجاح",
        description: "تم إعادة إرسال رمز التحقق إلى بريدك الإلكتروني!",
      });
    } catch (error: any) {
      console.error("request-otp error:", error);
      setServerError(
        error?.response?.data?.message ||
        error.message ||
        "تعذر إعادة إرسال رمز التحقق."
      );
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mb-6 text-sm text-slate-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          <span>رجوع</span>
        </button>

        <div className="text-center mb-8">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#EEF2FF" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="2">
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
              <polyline points="3 7 12 13 21 7"></polyline>
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            تأكيد البريد الإلكتروني
          </h2>
          <p className="text-sm text-slate-600 mb-1">تم إرسال رمز التحقق إلى</p>
          <p className="text-sm font-medium text-blue-600">{email}</p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3 text-right">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-3 text-center">
              أدخل رمز التحقق
            </label>

            <div className="flex gap-2 justify-center" dir="ltr">
              {values.map((val, idx) => (
                <input
                  key={idx}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  type="text"
                  maxLength={1}
                  value={val}
                  onChange={(e) => handleChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-12 h-12 text-center text-xl font-semibold border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  required
                />
              ))}
            </div>

            {error && (
              <p className="mt-2 text-xs text-red-500 text-center">{error}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition shadow-lg w-full justify-center disabled:opacity-60"
          >
            {isSubmitting ? "جاري التحقق..." : "تأكيد الحساب"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 mb-2">لم تستلم الرمز؟</p>
          <button
            type="button"
            onClick={resendOtp}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            إعادة إرسال الرمز
          </button>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
