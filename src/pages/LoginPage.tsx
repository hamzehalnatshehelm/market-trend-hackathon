import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("تم تسجيل الدخول بنجاح!");
    navigate("/");
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
          <p className="text-sm text-slate-600">أدخل بياناتك للوصول إلى حسابك</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
              البريد الإلكتروني
            </label>
            <Input type="email" required placeholder="name@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 text-right">
              كلمة المرور
            </label>
            <Input type="password" required placeholder="أدخل كلمة المرور" />
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <Checkbox />
              <span className="text-slate-700">تذكرني</span>
            </label>
            <button type="button" className="text-blue-600 hover:text-blue-700">
              نسيت كلمة المرور؟
            </button>
          </div>
          <button type="submit" className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl w-full justify-center">
            تسجيل الدخول
          </button>
        </form>

        <p className="text-center
 mt-6 text-sm text-slate-600">
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
