import { useState, useEffect } from 'react';
import { X, Calendar, Building2, ChevronDown, Users } from 'lucide-react';
import { QueryData, CompanyData } from '../pages/ImportExportDashboard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface DrilldownModalProps {
  month: string;
  query: QueryData;
  onClose: () => void;
}

export function DrilldownModal({ month, query, onClose }: DrilldownModalProps) {
  const [showOthersBreakdown, setShowOthersBreakdown] = useState(false);
  const [showImportersBreakdown, setShowImportersBreakdown] = useState(false);

  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [othersBreakdown, setOthersBreakdown] = useState<CompanyData[]>([]);
  const [importerData, setImporterData] = useState<CompanyData[]>([]);
  const [importersOthersBreakdown, setImportersOthersBreakdown] = useState<CompanyData[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  // ✅ نفس الـ fallback المستخدم في ChartDisplay
  const FALLBACK_COMPANY_CHARTS = {
    clearanceCompanies: [
      { name: 'الشركة الوطنية للاستيراد', value: 37, percentage: 37, color: '#1e5a7d' },
      { name: 'شركة أحمد الحمد للتخليص', value: 26, percentage: 26, color: '#f59e42' },
      { name: 'شركة الأماني للاستيراد والتصدير', value: 20, percentage: 20, color: '#2d7a4f' },
      { name: 'آخرون', value: 17, percentage: 17, color: '#4db8d8' },
    ],
    clearanceOthers: [
      { name: 'شركة النجاح للتخليص', value: 5, percentage: 5, color: '#8b5cf6' },
      { name: 'شركة الفجر للخدمات الجمركية', value: 4, percentage: 4, color: '#ec4899' },
      { name: 'شركة البحر الأحمر', value: 3, percentage: 3, color: '#f97316' },
      { name: 'شركة المستقبل', value: 2.5, percentage: 2.5, color: '#14b8a6' },
      { name: 'شركات أخرى', value: 2.5, percentage: 2.5, color: '#6366f1' },
    ],
    importers: [
      { name: 'شركة الرياض للتجارة', value: 28, percentage: 28, color: '#0ea5e9' },
      { name: 'مؤسسة جدة للاستيراد', value: 22, percentage: 22, color: '#8b5cf6' },
      { name: 'شركة الشرق للمواد الغذائية', value: 18, percentage: 18, color: '#10b981' },
      { name: 'شركة الخليج للتوزيع', value: 15, percentage: 15, color: '#f59e0b' },
      { name: 'آخرون', value: 17, percentage: 17, color: '#6366f1' },
    ],
    importersOthers: [
      { name: 'شركة النور للتجارة', value: 6, percentage: 6, color: '#ec4899' },
      { name: 'مؤسسة الأمل', value: 4, percentage: 4, color: '#14b8a6' },
      { name: 'شركة الفجر الجديد', value: 3, percentage: 3, color: '#f97316' },
      { name: 'مستوردون آخرون', value: 4, percentage: 4, color: '#64748b' },
    ],
  };

  // Get metric label
  const getMetricLabel = () => {
    switch (query.metric) {
      case 'عدد الوحدات':
        return 'الوحدات';
      case 'الوزن الإجمالي':
        return 'الوزن';
      case 'عدد الشحنات':
        return 'الشحنات';
      default:
        return 'الوحدات';
    }
  };

  // Get direction label
  const getDirectionLabel = () => {
    return query.location === 'استيراد' ? 'الاستيراد' : 'التصدير';
  };

  // Generate mock daily data for the month
  const dailyData = Array.from({ length: 30 }, (_, i) => ({
    name: `${i + 1}`,
    value: Math.floor(Math.random() * 3000) + 1000,
  }));

  // 🛰️ جلب بيانات الشركات من الـ API
  useEffect(() => {
    const fetchCompanyCharts = async () => {
      setIsLoadingCompanies(true);
      setCompaniesError(null);

      try {
        const res = await fetch('http://localhost:4000/companyCharts');
        if (!res.ok) {
          throw new Error('Failed to load company charts');
        }

        const payload = await res.json();

        setCompanyData(payload.clearanceCompanies ?? FALLBACK_COMPANY_CHARTS.clearanceCompanies);
        setOthersBreakdown(payload.clearanceOthers ?? FALLBACK_COMPANY_CHARTS.clearanceOthers);
        setImporterData(payload.importers ?? FALLBACK_COMPANY_CHARTS.importers);
        setImportersOthersBreakdown(
          payload.importersOthers ?? FALLBACK_COMPANY_CHARTS.importersOthers
        );
      } catch (error) {
        console.error('Error loading company charts (drilldown):', error);
        setCompaniesError(
          'تعذر تحميل بيانات شركات التخليص والمستوردين، تم استخدام بيانات افتراضية.'
        );
        setCompanyData(FALLBACK_COMPANY_CHARTS.clearanceCompanies);
        setOthersBreakdown(FALLBACK_COMPANY_CHARTS.clearanceOthers);
        setImporterData(FALLBACK_COMPANY_CHARTS.importers);
        setImportersOthersBreakdown(FALLBACK_COMPANY_CHARTS.importersOthers);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanyCharts();
  }, [query, month]);

  const CustomLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percentage,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 30;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#334155"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '14px', fontWeight: '600' }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto"
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-slate-900">تفاصيل شهر {month}</h2>
              <p className="text-slate-600">
                {query.productCategory} - من {query.period.from} إلى {query.period.to}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Daily breakdown chart */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">
              التوزيع اليومي لـ{getMetricLabel()} - {month}
            </h3>
            <div className="h-80 bg-white rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={dailyData}
                  margin={{ top: 20, right: 10, left: 10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    label={{ value: 'اليوم', position: 'insideBottom', offset: -5 }}
                  />
                  <YAxis
                    stroke="#64748b"
                    style={{ fontSize: '12px' }}
                    tickFormatter={(value) => value.toLocaleString('ar-SA')}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      direction: 'rtl',
                    }}
                    formatter={(value: number) => [value.toLocaleString('ar-SA'), query.metric]}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Company distribution pie chart */}
          <div className="bg-slate-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="w-5 h-5 text-slate-600" />
              <div>
                <h3 className="text-slate-900">توزيع شركات التخليص الجمركي</h3>
                {isLoadingCompanies && (
                  <p className="text-xs text-slate-500 mt-1">
                    جاري تحميل بيانات الشركات...
                  </p>
                )}
                {companiesError && (
                  <p className="text-xs text-amber-600 mt-1">{companiesError}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={companyData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => (
                          <CustomLabel {...props} percentage={props.percentage} />
                        )}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {companyData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          direction: 'rtl',
                        }}
                        formatter={(value: number) => [`${value}%`, 'النسبة']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                {companyData.map((company, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        if (company.name === 'آخرون') {
                          setShowOthersBreakdown(!showOthersBreakdown);
                        }
                      }}
                      className={`w-full bg-white rounded-lg p-4 border border-slate-200 ${
                        company.name === 'آخرون'
                          ? 'hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                          : ''
                      } transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: company.color }}
                          />
                          <span className="text-slate-900">{company.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900">
                            {company.percentage}%
                          </span>
                          {company.name === 'آخرون' && (
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                showOthersBreakdown ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Others breakdown */}
                    {company.name === 'آخرون' && showOthersBreakdown && (
                      <div className="mr-8 mt-2 space-y-2 bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-600 mb-2">تفاصيل الـ 17%:</p>
                        {othersBreakdown.map((otherCompany, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: otherCompany.color }}
                              />
                              <span className="text-slate-700">
                                {otherCompany.name}
                              </span>
                            </div>
                            <span className="text-slate-700">
                              {otherCompany.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Importers distribution pie chart */}
          <div className="bg-slate-50 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                {query.location === 'استيراد'
                  ? 'حجم استيراد المستوردين الحاليين'
                  : 'حجم تصدير المصدرين الحاليين'}
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg p-6">
                <div className="h-80 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={importerData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={(props) => (
                          <CustomLabel {...props} percentage={props.percentage} />
                        )}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {importerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          direction: 'rtl',
                        }}
                        formatter={(value: number) => [`${value}%`, 'النسبة']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                {importerData.map((company, index) => (
                  <div key={index}>
                    <button
                      onClick={() => {
                        if (company.name === 'آخرون') {
                          setShowImportersBreakdown(!showImportersBreakdown);
                        }
                      }}
                      className={`w-full bg-white rounded-lg p-4 border border-slate-200 ${
                        company.name === 'آخرون'
                          ? 'hover:border-blue-400 hover:bg-blue-50 cursor-pointer'
                          : ''
                      } transition-all`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: company.color }}
                          />
                          <span className="text-slate-900">{company.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-900">
                            {company.percentage}%
                          </span>
                          {company.name === 'آخرون' && (
                            <ChevronDown
                              className={`w-4 h-4 text-slate-400 transition-transform ${
                                showImportersBreakdown ? 'rotate-180' : ''
                              }`}
                            />
                          )}
                        </div>
                      </div>
                    </button>

                    {/* Others breakdown */}
                    {company.name === 'آخرون' && showImportersBreakdown && (
                      <div className="mr-8 mt-2 space-y-2 bg-slate-50 rounded-lg p-3">
                        <p className="text-slate-600 mb-2">تفاصيل الـ 17%:</p>
                        {importersOthersBreakdown.map((otherCompany, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between bg-white rounded-lg p-3"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: otherCompany.color }}
                              />
                              <span className="text-slate-700">
                                {otherCompany.name}
                              </span>
                            </div>
                            <span className="text-slate-700">
                              {otherCompany.percentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Companies list (تبقى ديمو ثابت لليوم) */}
          <div className="bg-slate-50 rounded-xl p-6">
            <h3 className="text-slate-900 mb-4">
              قائمة شركات التخليص الجمركي مرتبة حسب حجم {getDirectionLabel()}
            </h3>
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-100">
                  <tr>
                    <th className="px-6 py-3 text-right text-slate-700">الترتيب</th>
                    <th className="px-6 py-3 text-right text-slate-700">اسم الشركة</th>
                    <th className="px-6 py-3 text-right text-slate-700">{query.metric}</th>
                    <th className="px-6 py-3 text-right text-slate-700">النسبة المئوية</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {[
                    { rank: 1, name: 'الشركة الوطنية للاستيراد', units: '18,500', percentage: '37%' },
                    { rank: 2, name: 'شركة أحمد الحمد للتخليص', units: '13,000', percentage: '26%' },
                    { rank: 3, name: 'شركة الأماني للاستيراد والتصدير', units: '10,000', percentage: '20%' },
                    { rank: 4, name: 'شركة النجاح للتخليص', units: '2,500', percentage: '5%' },
                    { rank: 5, name: 'شركة الفجر للخدمات الجمركية', units: '2,000', percentage: '4%' },
                    { rank: 6, name: 'شركة البحر الأحمر', units: '1,500', percentage: '3%' },
                    { rank: 7, name: 'شركة المستقبل', units: '1,250', percentage: '2.5%' },
                  ].map((company) => (
                    <tr key={company.rank} className="hover:bg-slate-50">
                      <td className="px-6 py-4 text-slate-900">#{company.rank}</td>
                      <td className="px-6 py-4 text-slate-900">{company.name}</td>
                      <td className="px-6 py-4 text-slate-900">{company.units}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {company.percentage}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
