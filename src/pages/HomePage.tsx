import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Globe2,
  FileText,
  ShieldCheck,
} from "lucide-react";

const HomePage: React.FC = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center"
      dir="rtl"
    >
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* الهيرو الأساسي */}
        <div className="grid gap-10 lg:grid-cols-[1.4fr,1fr] items-center">
          {/* يسار: شرح المنتج */}
          <div className="space-y-8">
            {/* لوجو + اسم النظام */}
            <div className="inline-flex items-center gap-3 bg-white/80 rounded-2xl shadow-lg px-4 py-3 border border-slate-100">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-md">
                <ArrowUpRight className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  اتجاهات السوق
                </p>
                <p className="text-xs text-slate-500">
                  نظام تحليل الشحنات التجارية
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-relaxed">
                حوِّل بيانات الاستيراد والتصدير
                <span className="text-indigo-600"> إلى قرارات فعلية</span>
              </h1>
              <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-xl">
                اتجاهات السوق يساعدك على فهم حركة المنتجات المستوردة والمصدّرة،
                تتبع أداء القطاعات المختلفة، واكتشاف الفرص في الأسواق المحلية
                والعالمية من خلال لوحات تفاعلية وتقارير ذكية جاهزة.
              </p>
            </div>

            {/* أزرار CTA */}
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/dashboard"
                className="px-7 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm md:text-base font-medium shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                ابدأ الاستعلام الآن
              </Link>

              <Link
                to="/login"
                className="px-7 py-3 rounded-lg bg-white border border-slate-200 text-slate-800 text-sm md:text-base font-medium hover:bg-slate-50 shadow-sm transition-all"
              >
                تسجيل الدخول
              </Link>

              <span className="text-xs text-slate-500">
                لا حاجة لخبرة تقنية متقدمة – كل شيء جاهز في لوحة واحدة.
              </span>
            </div>

            {/* نقاط selling سريعة */}
            <div className="grid gap-4 sm:grid-cols-3 text-sm">
              <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
                <p className="font-semibold text-slate-800 mb-1">
                  رؤية شاملة للسوق
                </p>
                <p className="text-slate-500 text-xs">
                  تحليل حسب القطاع، المنفذ، التعريفة، والفترة الزمنية.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
                <p className="font-semibold text-slate-800 mb-1">
                  بيانات موثوقة
                </p>
                <p className="text-slate-500 text-xs">
                  استعلامات مبنية على بيانات رسمية محدثة بشكل دوري.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
                <p className="font-semibold text-slate-800 mb-1">
                  تقارير جاهزة للمشاركة
                </p>
                <p className="text-slate-500 text-xs">
                  تصدير النتائج إلى Excel ومشاركتها مع فريقك.
                </p>
              </div>
            </div>
          </div>

          {/* يمين: كرت خاص بالاستيراد والتصدير */}
          <section className="bg-white rounded-xl border border-slate-100 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-slate-900 mb-1">
                  وسع نظاق بحثك
                </h2>
                <p className="text-xs md:text-sm text-slate-500">
                  ركّز على منتج أو مجموعة منتجات محددة، واعرف حجم حركتها عبر
                  المنافذ والقطاعات المختلفة.
                </p>
              </div>
              <div className="hidden sm:flex items-center justify-center p-3 rounded-2xl bg-white shadow-sm border border-slate-100">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3 text-sm">
              <FeatureItem
                icon={<Globe2 className="w-4 h-4" />}
                title="تحليل الوضع التنافسي"
                description="تعرف على مكانك في السوق بحسب حجم وارداتك أو صادراتك"
              />
              <FeatureItem
                icon={<FileText className="w-4 h-4" />}
                title="مؤشرات حجم الشحنات"
                description="متوسط عدد الشحنات، أعلى شهر نشاطًا، واتجاه النمو أو الانخفاض خلال الفترة المختارة."
              />
              <FeatureItem
                icon={<ShieldCheck className="w-4 h-4" />}
                title="الربط بالتعرفة الجمركية"
                description="استعرض البنود التعريفية المرتبطة بالمنتج وحدد أكثرها تكرارًا لتقييم الرسوم والالتزامات."
              />
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200 text-[11px] md:text-xs text-slate-500 flex flex-col md:flex-row items-center justify-between gap-2">
              <span>
                مثالي للجهات الحكومية، شركات الاستشارات، والمستوردين والمصدّرين
                الباحثين عن رؤية أوضح لحركة السوق.
              </span>
              <span className="text-indigo-600 font-medium">
                بيانات تفاعلية – استعلامات متعددة الأبعاد – تصدير مباشر للتقارير
              </span>
            </div>
          </section>
        </div>

        {/* سطر بسيط في الأسفل */}
        <div className="mt-10 text-center text-xs text-slate-400">
          &copy; 2025 اتجاهات السوق. جميع الحقوق محفوظة.
        </div>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({
  icon,
  title,
  description,
}) => (
  <div className="flex gap-3 items-start">
    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm border border-slate-100">
      {icon}
    </div>
    <div>
      <p className="font-semibold text-slate-800 mb-1 text-sm">{title}</p>
      <p className="text-xs text-slate-500 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default HomePage;
