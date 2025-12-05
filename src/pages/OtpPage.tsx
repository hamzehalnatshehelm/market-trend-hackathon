import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

interface OtpLocationState {
  state?: {
    email?: string;
  };
}

const OtpPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as OtpLocationState;
  const email = location.state?.email || "";

  // 6 خانات OTP
  const [values, setValues] = useState<string[]>(["", "", "", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // لو دخل مباشرة على صفحة OTP بدون إيميل
    if (!email) {
      navigate("/login");
    }
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

    if (otp.length !== values.length) {
      setError("الرجاء إدخال رمز التحقق بالكامل.");
      return;
    }

    try {
      setIsSubmitting(true);

      const res = await fetch(
        "http://10.44.148.143:6061/user-management/auth/verify-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      if (!res.ok) {
        try {
          const errorData = await res.json();
          if (errorData?.message) {
            throw new Error(errorData.message);
          }
        } catch {
          // تجاهل خطأ الـ JSON
        }
        throw new Error("رمز التحقق غير صحيح أو منتهي، الرجاء المحاولة مرة أخرى.");
      }

      // الرد حسب كلامك:
      // { "email": "honiazy@elm.sa", "otp": 647704 }
      // تقدر تقراه لو حاب:
      // const data = await res.json();

      alert("تم تأكيد الحساب بنجاح!");
      navigate("/subscription"); // أو "/" حسب ما تحب
    } catch (err: any) {
      setServerError(err.message || "حدث خطأ غير متوقع، الرجاء المحاولة لاحقاً.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    setError(null);
    setServerError(null);

    try {
      const res = await fetch(
        "http://10.44.148.143:6061/user-management/auth/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!res.ok) {
        throw new Error("تعذر إعادة إرسال رمز التحقق، الرجاء المحاولة لاحقاً.");
      }

      alert("تم إعادة إرسال رمز التحقق!");
    } catch (err: any) {
      setServerError(err.message || "حدث خطأ غير متوقع، الرجاء المحاولة لاحقاً.");
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8">
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
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#4F46E5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" ry="2"></rect>
              <polyline points="3 7 12 13 21 7"></polyline>
            </svg>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900 mb-2">
            تأكيد البريد الإلكتروني
          </h2>
          <p className="text-sm text-slate-600 mb-1">تم إرسال رمز التحقق إلى</p>
          <p className="text-sm font-medium text-blue-600">
            {email || "example@email.com"}
          </p>
        </div>

        {serverError && (
          <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 text-right">
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
                  className="w-10 h-12 text-center text-lg font-semibold border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
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
