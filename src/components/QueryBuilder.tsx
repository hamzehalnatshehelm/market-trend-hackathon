import { useState, useEffect } from 'react';
import { Search, Info } from 'lucide-react';
import axios from 'axios';
import { QueryData } from '../pages/ImportExportDashboard';
import { TariffTreeSelect } from './TariffTreeSelect';

interface QueryBuilderProps {
  onSubmit: (query: QueryData) => void;
  initialQuery: QueryData;
}

// شكل بيانات المنافذ بعد المابينج
interface PortTypeGroup {
  id: number;
  label: string; // اسم النوع (بحري / بري / جوي / سكة حديدية ...)
  ports: {
    code: string; // portCode
    label: string; // الاسم بالعربي أو الإنجليزي
  }[];
}

// 👇 شكل القطاع بعد التعديل: نخزن id و label
interface SectorOption {
  id: string;    // sectionCd (مثلاً "03")
  label: string; // "03 - الأسماك ..."
}

export function QueryBuilder({ onSubmit, initialQuery }: QueryBuilderProps) {
  const [query, setQuery] = useState<QueryData>(initialQuery);
  const [sectorSearchQuery, setSectorSearchQuery] = useState('');
  const [showSectorDropdown, setShowSectorDropdown] = useState(false);

  // ✅ القطاعات
  const [sectors, setSectors] = useState<SectorOption[]>([]);
  const [sectorsLoading, setSectorsLoading] = useState(false);
  const [sectorsError, setSectorsError] = useState<string | null>(null);

  // ✅ المنافذ من /market-trends/v1/port-types
  const [portTypes, setPortTypes] = useState<PortTypeGroup[]>([]);
  const [portsLoading, setPortsLoading] = useState(false);
  const [portsError, setPortsError] = useState<string | null>(null);

  const FALLBACK_SECTORS: SectorOption[] = [];

  const FALLBACK_METRICS: { name: string; value: string }[] = [
    { name: 'عدد الوحدات', value: 'QUANTITY' },
    { name: 'الوزن الإجمالي', value: 'WEIGHT' },
  ];

  const FALLBACK_DIRECTIONS: { name: string; value: string }[] = [
    { name: 'استيراد', value: 'IMP' },
    { name: 'تصدير', value: 'EXP' },
  ];

  const metrics = FALLBACK_METRICS;
  const directions = FALLBACK_DIRECTIONS;

  // لو initialQuery تغيّر من الأب نحدث الـ state
  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  // 🔄 تحميل القطاعات من API /market-trends/v1/sections
  useEffect(() => {
    const fetchSectors = async () => {
      setSectorsLoading(true);
      setSectorsError(null);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/market-trends/v1/sections`
        );

        const data = res.data.response as Array<{
          sectionCd: string;
          sectionDescAr: string;
          sectionDescEn: string;
        }>;

        let list: SectorOption[] = [];

        if (Array.isArray(data)) {
          list = data.map((item) => ({
            id: item.sectionCd, // 👈 هذا هو الـ sectionId الحقيقي
            label: `${item.sectionCd} - ${
              item.sectionDescAr ?? item.sectionDescEn ?? ''
            }`,
          }));

          // (اختياري) ترتيب حسب النص
          list.sort((a, b) => a.label.localeCompare(b.label, 'ar'));
        }

        if (!list.length && FALLBACK_SECTORS.length) {
          setSectors(FALLBACK_SECTORS);
        } else {
          setSectors(list);
        }
      } catch (error) {
        console.error('Error loading sectors:', error);
        setSectorsError('تعذر تحميل القطاعات من النظام.');
        setSectors(FALLBACK_SECTORS);
      } finally {
        setSectorsLoading(false);
      }
    };

    fetchSectors();
  }, []);

  // 🔄 تحميل المنافذ من /market-trends/v1/port-types
  useEffect(() => {
    const fetchPorts = async () => {
      setPortsLoading(true);
      setPortsError(null);

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/market-trends/v1/port-types`
        );

        const raw = res.data?.response as any[];

        const mapped: PortTypeGroup[] = Array.isArray(raw)
          ? raw.map((type) => ({
              id: type.id,
              label: type.nameAr ?? type.nameEn ?? `نوع منفذ ${type.id}`,
              ports: Array.isArray(type.ports)
                ? type.ports.map((p: any) => ({
                    code: String(p.portCode),
                    label:
                      p.codeDescAr ?? p.codeDescEn ?? String(p.portCode),
                  }))
                : [],
            }))
          : [];

        setPortTypes(mapped);
      } catch (error) {
        console.error('Error loading port types:', error);
        setPortsError('تعذر تحميل المنافذ من النظام.');
        setPortTypes([]);
      } finally {
        setPortsLoading(false);
      }
    };

    fetchPorts();
  }, []);

  // فلترة القطاعات حسب البحث
  const filteredSectors = sectors.filter((sector) =>
    sector.label.toLowerCase().includes(sectorSearchQuery.toLowerCase())
  );

  // دالة تجيب النص المعروض للقطاع من الـ id الموجود في query.sector
  const getSectorLabelById = (id?: string) => {
    if (!id) return '';
    const found = sectors.find((s) => s.id === id);
    return found?.label ?? id;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(query);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-semibold text-slate-900">بناء الاستعلام</h2>
        {(sectorsLoading || portsLoading) && (
          <span className="text-xs text-slate-500">
            {sectorsLoading && 'جاري تحميل القطاعات من النظام...'}
            {sectorsLoading && portsLoading && ' · '}
            {portsLoading && 'جاري تحميل المنافذ من النظام...'}
          </span>
        )}
      </div>

      {sectorsError && (
        <p className="text-xs text-amber-600 mb-1">{sectorsError}</p>
      )}
      {portsError && (
        <p className="text-xs text-amber-600 mb-4">{portsError}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* القطاع + بحث */}
          <div className="relative">
            <label className="block text-slate-700 mb-2">القطاع</label>
            <div className="relative">
              <input
                type="text"
                value={
                  sectorSearchQuery ||
                  getSectorLabelById(query.sector) ||
                  ''
                }
                onChange={(e) => {
                  setSectorSearchQuery(e.target.value);
                  setShowSectorDropdown(true);
                }}
                onFocus={() => setShowSectorDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowSectorDropdown(false), 200)
                }
                placeholder="ابحث أو اختر قطاع..."
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              />
              {showSectorDropdown && filteredSectors.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-slate-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {filteredSectors.map((sector) => (
                    <div
                      key={sector.id}
                      onClick={() => {
                        // 👈 نخزن فقط id (sectionId) في query.sector
                        setQuery({ ...query, sector: sector.id });
                        setSectorSearchQuery('');
                        setShowSectorDropdown(false);
                      }}
                      className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                    >
                      {sector.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {(!query.sector || query.sector === 'جميع القطاعات') && (
              <div className="flex items-start gap-2 mt-2 text-amber-700 bg-amber-50 px-3 py-2 rounded-lg text-sm">
                <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>اختيار قطاع محدد قد يساعدك في الوصول إلى المنتج</span>
              </div>
            )}
          </div>

          {/* التعرفة */}
          <div>
            <label className="block text-slate-700 mb-2">التعرفة</label>
            <TariffTreeSelect
              selectedItems={
                Array.isArray(query.productCategory)
                  ? (query.productCategory as unknown as string[])
                  : query.productCategory &&
                    query.productCategory !== 'اختر التعرفة'
                  ? query.productCategory
                      .split(',')
                      .map((s) => s.trim())
                      .filter(Boolean)
                  : []
              }
              onChange={(items) => {
                const newValue =
                  items.length === 0 ? 'اختر التعرفة' : items.join(',');
                console.log('QueryBuilder productCategory =', newValue);
                setQuery({ ...query, productCategory: newValue });
              }}
              // الآن TariffTreeSelect يستقبل sectorId (مثلاً "03")
              sector={query.sector}
            />
          </div>

          {/* الاتجاه */}
          <div>
            <label className="block text-slate-700 mb-2">الاتجاه</label>
            <select
              value={query.direction}
              onChange={(e) =>
                setQuery({ ...query, direction: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {directions.map((direction) => (
                <option key={direction.value} value={direction.value}>
                  {direction.name}
                </option>
              ))}
            </select>
          </div>

          {/* المقياس */}
          <div>
            <label className="block text-slate-700 mb-2">المقياس</label>
            <select
              value={query.metric}
              onChange={(e) =>
                setQuery({ ...query, metric: e.target.value })
              }
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {metrics.map((metric) => (
                <option key={metric.value} value={metric.value}>
                  {metric.name}
                </option>
              ))}
            </select>
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

          {/* المنفذ من API */}
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-slate-700 mb-2">المنفذ</label>
            <select
              value={query.port}
              onChange={(e) => setQuery({ ...query, port: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {/* خيار عام */}
              <option value="جميع المنافذ">جميع المنافذ</option>

              {portTypes.map((group) => (
                <optgroup key={group.id} label={group.label}>
                  {/* (اختياري) جميع منافذ هذا النوع */}
                  <option value={`ALL_TYPE_${group.id}`}>
                    جميع منافذ {group.label}
                  </option>
                  {group.ports.map((port) => (
                    <option key={port.code} value={port.code}>
                      {port.label}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Search className="w-5 h-5" />
            <span>تنفيذ الاستعلام</span>
          </button>
        </div>
      </form>
    </div>
  );
}
