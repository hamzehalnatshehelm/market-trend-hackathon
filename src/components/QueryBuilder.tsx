import { useState, useEffect } from 'react';
import { Search, Info } from 'lucide-react';
import { QueryData } from '../pages/ImportExportDashboard';
import { TariffTreeSelect } from './TariffTreeSelect';

interface QueryBuilderProps {
  onSubmit: (query: QueryData) => void;
  initialQuery: QueryData;
}

interface QueryOptionsResponse {
  sectors: string[];
  metrics: string[];
  directions: string[];
  ports: Record<string, string[]>; // مثال: { "البحرية": ["ميناء جدة", ...] }
}

// Fallback values لو الـ API فشل
const FALLBACK_OPTIONS: QueryOptionsResponse = {
  sectors: [
    'جميع القطاعات',
    'استيراد مواد التنظيف',
    'استيراد المواد الغذائية',
    'استيراد الإلكترونيات',
    'استيراد مواد البناء',
    'استيراد المنسوجات',
  ],
  metrics: ['عدد الوحدات', 'الوزن الإجمالي', 'عدد الشحنات'],
  directions: ['استيراد', 'تصدير'],
  ports: {
    'جميع المنافذ': [],
    'البحرية': [
      'جميع المنافذ البحرية',
      'ميناء جدة الإسلامي',
      'ميناء الملك عبدالعزيز',
      'ميناء الدمام',
      'ميناء الجبيل',
      'ميناء ينبع',
    ],
    'البرية': [
      'جميع المنافذ البرية',
      'منفذ القريات',
      'منفذ الحديثة',
      'منفذ البطحاء',
      'منفذ الربع الخالي',
      'منفذ جديدة عرعر',
    ],
    'الجوية': [
      'جميع المنافذ الجوية',
      'مطار الملك عبدالعزيز الدولي - جدة',
      'مطار الملك خالد الدولي - الرياض',
      'مطار الملك فهد الدولي - الدمام',
      'مطار الأمير محمد بن عبدالعزيز - المدينة المنورة',
    ],
  },
};

export function QueryBuilder({ onSubmit, initialQuery }: QueryBuilderProps) {
  const [query, setQuery] = useState<QueryData>(initialQuery);
  const [sectorSearchQuery, setSectorSearchQuery] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  const [options, setOptions] = useState<QueryOptionsResponse | null>(null);
  const [isLoadingOptions, setIsLoadingOptions] = useState(false);
  const [optionsError, setOptionsError] = useState<string | null>(null);

  // لو initialQuery تغير من الأب (مثلاً بعد استرجاع محفوظات أو رابط فيه params)
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // 🛰️ تحميل القوائم من API مرة واحدة عند تحميل الكومبوننت
  useEffect(() => {
    const fetchOptions = async () => {
      setIsLoadingOptions(true);
      setOptionsError(null);
      try {
        const res = await fetch('http://localhost:4000/queryOptions');
        if (!res.ok) {
          throw new Error('Failed to load query options');
        }
        const data = (await res.json()) as QueryOptionsResponse;
        setOptions(data);
      } catch (err) {
        console.error('Error loading query options:', err);
        setOptions(FALLBACK_OPTIONS);
        setOptionsError('تعذر تحميل خيارات الاستعلام، تم استخدام الإعدادات الافتراضية.');
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // استخدم اللي جاي من الـ API أو الـ fallback
  const sectors = (options ?? FALLBACK_OPTIONS).sectors;
  const metrics = (options ?? FALLBACK_OPTIONS).metrics;
  const directions = (options ?? FALLBACK_OPTIONS).directions;
  const ports = (options ?? FALLBACK_OPTIONS).ports;

  const filteredSectors = sectors.filter((sector) =>
    sector.toLowerCase().includes(sectorSearchQuery.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-900">بناء الاستعلام</h2>
        {isLoadingOptions && (
          <span className="text-xs text-slate-500">جاري تحميل خيارات البحث...</span>
        )}
      </div>

      {optionsError && (
        <div className="mb-4 text-sm text-amber-700 bg-amber-50 px-3 py-2 rounded-lg">
          {optionsError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* القطاع */}
          <div className="relative">
            <label className="block text-slate-700 mb-2">القطاع</label>
            <div className="relative">
              <input
                type="text"
                value={sectorSearchQuery || query.sector}
                onChange={(e) => {
                  setSectorSearchQuery(e.target.value);
                  setShowSectorDropdown(true);
                }}
                onFocus={() => setShowSectorDropdown(true)}
                onBlur={() => setTimeout(() => setShowSectorDropdown(false), 200)}
                placeholder="ابحث أو اختر قطاع..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              {showSectorDropdown && filteredSectors.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSectors.map((sector) => (
                    <div
                      key={sector}
                      onClick={() => {
                        setQuery({ ...query, sector });
                        setSectorSearchQuery('');
                        setShowSectorDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {sector}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(query.sector === 'جميع القطاعات' || !query.sector) && (
              <div className="flex items-start gap-2 mt-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg text-sm">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>اختيار قطاع محدد قد يساعدك في الوصول إلى المنتج</span>
              </div>
            )}
          </div>

          {/* المقياس */}
          <div>
            <label className="block text-slate-700 mb-2">المقياس</label>
            <select
              value={query.metric}
              onChange={(e) => setQuery({ ...query, metric: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {metrics.map((metric) => (
                <option key={metric} value={metric}>
                  {metric}
                </option>
              ))}
            </select>
          </div>

          {/* الاتجاه */}
          <div>
            <label className="block text-slate-700 mb-2">الاتجاه</label>
            <select
              value={query.location}
              onChange={(e) => setQuery({ ...query, location: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {directions.map((direction) => (
                <option key={direction} value={direction}>
                  {direction}
                </option>
              ))}
            </select>
          </div>

          {/* التعرفة */}
          <div>
            <label className="block text-slate-700 mb-2">التعرفة</label>
            <TariffTreeSelect
              selectedItems={
                Array.isArray(query.productCategory)
                  ? (query.productCategory as unknown as string[])
                  : query.productCategory && query.productCategory !== 'اختر التعرفة'
                  ? query.productCategory.split(', ').filter(Boolean)
                  : []
              }
              onChange={(items) => {
                const newValue =
                  items.length === 0
                    ? 'اختر التعرفة'
                    : items.length === 1
                    ? items[0]
                    : items.join(', ');
                setQuery({ ...query, productCategory: newValue });
              }}
              sector={query.sector}
            />
          </div>

          {/* من تاريخ */}
          <div>
            <label className="block text-slate-700 mb-2">من تاريخ</label>
            <input
              type="date"
              value={query.period.from}
              onChange={(e) =>
                setQuery({
                  ...query,
                  period: { ...query.period, from: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* إلى تاريخ */}
          <div>
            <label className="block text-slate-700 mb-2">إلى تاريخ</label>
            <input
              type="date"
              value={query.period.to}
              onChange={(e) =>
                setQuery({
                  ...query,
                  period: { ...query.period, to: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            />
          </div>

          {/* المنفذ */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-slate-700 mb-2">المنفذ</label>
            <select
              value={query.port}
              onChange={(e) => setQuery({ ...query, port: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {Object.entries(ports).map(([category, items]) =>
                items.length === 0 ? (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ) : (
                  <optgroup key={category} label={category}>
                    {items.map((port) => (
                      <option key={port} value={port}>
                        {port}
                      </option>
                    ))}
                  </optgroup>
                )
              )}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Search className="w-5 ه-5" />
            <span>تنفيذ الاستعلام</span>
          </button>
        </div>
      </form>
    </div>
  );
}
