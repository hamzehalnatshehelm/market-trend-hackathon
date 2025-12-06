import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  TrendingUp,
  Download,
  Info,
  MousePointerClick,
  Building2,
  Users,
  Calendar,
} from 'lucide-react';
import { ChartDataPoint, QueryData, CompanyData } from '../pages/ImportExportDashboard';

interface ChartDisplayProps {
  data: ChartDataPoint[];
  query: QueryData;
  onMonthClick: (monthName: string) => void;
  showMonthClickHint?: boolean;
}

export function ChartDisplay({
  data,
  query,
  onMonthClick,
  showMonthClickHint,
}: ChartDisplayProps) {
  const [showOthersBreakdown, setShowOthersBreakdown] = useState(false);
  const [showImportersBreakdown, setShowImportersBreakdown] = useState(false);
  const [showHintMessage, setShowHintMessage] = useState(true);
  const [timeGrouping, setTimeGrouping] = useState<'month' | 'quarter' | 'half' | 'year' | 'decade'>('month');

  // 🧩 بيانات الشركات من الـ API
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [othersBreakdown, setOthersBreakdown] = useState<CompanyData[]>([]);
  const [importerData, setImporterData] = useState<CompanyData[]>([]);
  const [importersOthersBreakdown, setImportersOthersBreakdown] = useState<CompanyData[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(false);
  const [companiesError, setCompaniesError] = useState<string | null>(null);

  // ✅ Fallback لو API الشركات فشل
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

  // Reset hint message when new query is executed
  useEffect(() => {
    setShowHintMessage(true);
  }, [query]);

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
        console.error('Error loading company charts:', error);
        // setCompaniesError(
        //   'تعذر تحميل بيانات شركات التخليص والمستوردين، تم استخدام بيانات افتراضية.'
        // );
        setCompanyData(FALLBACK_COMPANY_CHARTS.clearanceCompanies);
        setOthersBreakdown(FALLBACK_COMPANY_CHARTS.clearanceOthers);
        setImporterData(FALLBACK_COMPANY_CHARTS.importers);
        setImportersOthersBreakdown(FALLBACK_COMPANY_CHARTS.importersOthers);
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    fetchCompanyCharts();
  }, [query]);

  // Group data based on time grouping selection
  const getGroupedData = () => {
    if (timeGrouping === 'month') return data;

    if (timeGrouping === 'quarter') {
      return [
        {
          name: 'الربع الأول',
          value: data.slice(0, 3).reduce((sum, d) => sum + d.value, 0),
        },
        {
          name: 'الربع الثاني',
          value: data.slice(3, 6).reduce((sum, d) => sum + d.value, 0),
        },
        {
          name: 'الربع الثالث',
          value: data.slice(6, 9).reduce((sum, d) => sum + d.value, 0),
        },
        {
          name: 'الربع الرابع',
          value: data.slice(9, 12).reduce((sum, d) => sum + d.value, 0),
        },
      ];
    } else if (timeGrouping === 'half') {
      return [
        {
          name: 'النصف الأول',
          value: data.slice(0, 6).reduce((sum, d) => sum + d.value, 0),
        },
        {
          name: 'النصف الثاني',
          value: data.slice(6, 12).reduce((sum, d) => sum + d.value, 0),
        },
      ];
    } else if (timeGrouping === 'year') {
      return [
        {
          name: '2025',
          value: data.reduce((sum, d) => sum + d.value, 0),
        },
      ];
    }

    return data;
  };

  const displayData = getGroupedData();

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const average = data.length > 0 ? Math.round(total / data.length) : 0;
  const max = data.length > 0 ? Math.max(...data.map((item) => item.value)) : 0;

  const handleBarClick = (payload: any) => {
    if (payload && payload.name) {
      onMonthClick(payload.name);
    }
  };

  const handleExport = () => {
    const headers = ['الفترة', query.metric];
    const csvData = [
      headers.join(','),
      ...data.map((item) => `${item.name},${item.value}`),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvData], {
      type: 'text/csv;charset=utf-8;',
    });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `تقرير_${query.productCategory}_${query.period.from}_${query.period.to}.csv`
    );
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        style={{ fontSize: '14px', fontWeight: 600 }}
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      {/* Header + Export */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">نتائج الاستعلام</h2>
          <p className="text-sm text-slate-600">
            {query.metric} في {query.sector} - {query.productCategory} ({query.location} من{' '}
            {query.period.from} إلى {query.period.to})
          </p>
          {showMonthClickHint && (
            <div className="flex items-center gap-2 mt-2 text-green-600 bg-green-50 px-3 py-2 rounded-lg w-fit animate-pulse">
              <MousePointerClick className="w-4 h-4" />
              <span className="text-sm">إذن اضغط على الشهر المعني</span>
            </div>
          )}
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>تصدير</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span>الإجمالي</span>
          </div>
          <div className="text-slate-900">{total.toLocaleString('ar-SA')}</div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-600 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span>المتوسط</span>
          </div>
          <div className="text-slate-900">{average.toLocaleString('ar-SA')}</div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <TrendingUp className="w-5 h-5" />
            <span>الحد الأقصى</span>
          </div>
          <div className="text-slate-900">{max.toLocaleString('ar-SA')}</div>
        </div>
      </div>

      {/* Time Grouping Controls */}
      <div className="mb-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-slate-600" />
          <span className="text-slate-700">عرض البيانات حسب:</span>
          <div className="flex gap-2">
            {[
              { value: 'month', label: 'شهر' },
              { value: 'quarter', label: 'ربع سنة' },
              { value: 'half', label: 'نصف سنة' },
              { value: 'year', label: 'سنة' },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setTimeGrouping(option.value as any)}
                className={`px-4 py-2 rounded-lg transition-all cursor-pointer ${
                  timeGrouping === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {showHintMessage && (
          <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-fit">
            <Info className="w-4 h-4" />
            <span className="text-sm">اضغط على أي عمود لعرض التفاصيل اليومية</span>
          </div>
        )}
      </div>

      {/* Bar Chart */}
      <div className="h-96 mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={displayData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="name" stroke="#64748b" style={{ fontSize: '14px' }} />
            <YAxis
              stroke="#64748b"
              style={{ fontSize: '14px' }}
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
            <Legend wrapperStyle={{ direction: 'rtl' }} formatter={() => query.metric} />
            <Bar
              dataKey="value"
              fill="#3b82f6"
              radius={[8, 8, 0, 0]}
              name={query.metric}
              onClick={handleBarClick}
              cursor="pointer"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Clearance Companies Pie */}
      <div className="border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              مساهمة شركات التخليص الجمركي
            </h3>
            <p className="text-sm text-slate-600">
              {query.location === 'استيراد'
                ? 'توزيع الشركات حسب حجم الاستيراد للفترة كاملة'
                : 'توزيع الشركات حسب حجم التصدير للفترة كاملة'}
            </p>
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
          <div className="bg-slate-50 rounded-lg p-6">
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
                  className={`w-full bg-slate-50 rounded-lg p-4 border border-slate-200 ${
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
                      <span className="text-slate-900">{company.percentage}%</span>
                      {company.name === 'آخرون' && (
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            showOthersBreakdown ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
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
      <div className="border-t border-slate-200 pt-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {query.location === 'استيراد'
                ? 'حجم استيراد المستوردين الحاليين'
                : 'حجم تصدير المصدرين الحاليين'}
            </h3>
            <p className="text-sm text-slate-600">
              {query.location === 'استيراد'
                ? 'توزيع المستوردين حسب حجم الاستيراد للفترة كاملة'
                : 'توزيع المصدرين حسب حجم التصدير للفترة كاملة'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-50 rounded-lg p-6">
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
                  className={`w-full bg-slate-50 rounded-lg p-4 border border-slate-200 ${
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
                        <svg
                          className={`w-4 h-4 text-slate-400 transition-transform ${
                            showImportersBreakdown ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
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
    </div>
  );
}
